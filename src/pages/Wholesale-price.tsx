import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import PriceChart from '../components/PriceChart.tsx';
import './Wholesale-price.css';

// API 응답 데이터 타입 정의
interface ShippingData {
  itemname: string;
  kindname: string;
  countyname: string;
  marketname: string;
  yyyy: string;
  regday: string;
  price: string;
}

// 전체 응답 타입
interface ApiResponse<T> {
  code: string;
  message: string;
  result: T;
}

// 차트 데이터 타입 정의
interface ChartData {
  date: string;
  price: number;
}

type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: (number | null)[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
};

const WholesalePricePage = () => {
  const [keyword, setKeyword] = useState<string>('사과'); // 타입 확실히 지정
  const [input, setInput] = useState<string>('사과'); // 타입 확실히 지정
  const [chartData, setChartData] = useState({ labels: [], datasets: [] } as ChartDataType);
  const [loading, setLoading] = useState(false);
  const [nationalData, setNationalData] = useState<ChartData[]>([]); // 제네릭 타입 지정
  const [localData, setLocalData] = useState<ChartData[]>([]); // 타입 지정
  const [regionApiData, setRegionApiData] = useState([]);
  const [regionChartData, setRegionChartData] = useState({ labels: [], datasets: [] } as ChartDataType);
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [itemList, setItemList] = useState<string[]>([]); // 제네릭 타입 지정

  // 기본 날짜 유틸 함수 추가
  function getDefaultStartDate() {
    const d = new Date();
    d.setDate(d.getDate() - 9);
    return d.toISOString().slice(0, 10);
  }
  function getDefaultEndDate() {
    return new Date().toISOString().slice(0, 10);
  }

  // 현재 날짜 기준으로 날짜 계산
  const getDateRange = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 14); // 14일 전 (2주)

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(today),
    };
  };

  // CSV에서 itemName만 추출 (최초 1회, fetch 사용)
  useEffect(() => {
    fetch('/items.csv')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').slice(1); // 첫 줄은 헤더
        const names = lines
          .map(line => line.split(',')[2])
          .filter(Boolean);
        setItemList(names);
      });
  }, []);

  // 관심품목을 백엔드에서 받아와서 기본값으로 사용
  useEffect(() => {
    const fetchInterestItem = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('/users/prefer-item', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const interest = res.data?.result;
        if (interest) {
          setKeyword(interest);
          setInput(interest);
        }
      } catch (e) {
        // 에러 시 무시하고 기본값(사과) 사용
      }
    };
    fetchInterestItem();
  }, []);

  // itemList가 로드된 후에도 관심품목이 목록에 없으면 fallback 처리
  useEffect(() => {
    if (itemList.length > 0 && !itemList.includes(keyword)) {
      setKeyword('사과');
      setInput('사과');
    }
  }, [itemList, keyword]);

  // 날짜를 yyyy-MM-dd -> yyyyMMdd로 변환하는 함수
  function formatDateToYYYYMMDD(dateStr: string) {
    return dateStr.replace(/-/g, '');
  }

  useEffect(() => {
    const fetchPriceData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        const response: AxiosResponse<ApiResponse<ShippingData[]>> = await axios.get(
          `/api/shipping-periods`,
          {
            params: {
              itemName: keyword,
              countryCode: '',
              startDate: formatDateToYYYYMMDD(startDate),
              endDate: formatDateToYYYYMMDD(endDate),
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const items = response.data.result;
        if (!Array.isArray(items)) {
          setChartData({ labels: [], datasets: [] });
          setNationalData([]);
          setLocalData([]);
          return;
        }

        // 지역별로 그룹화
        const grouped: { [county: string]: ChartData[] } = {};
        items
          .filter((item) => item.countyname !== '평년')
          .forEach((item) => {
            const date = `${item.yyyy}-${item.regday.replace('/', '-')}`;
            const price = Number(item.price.replace(/,/g, ''));
            if (!grouped[item.countyname]) grouped[item.countyname] = [];
            grouped[item.countyname].push({ date, price });
          });

        // 모든 날짜(라벨) 추출 (서울 기준)
        const counties = Object.keys(grouped);
        const labels = grouped[counties[0]]?.map(item => item.date) || [];

        // 색상 배열
        const colors = [
          'rgba(255,99,132,1)', 'rgba(54,162,235,1)', 'rgba(255,206,86,1)',
          'rgba(75,192,192,1)', 'rgba(153,102,255,1)', 'rgba(255,159,64,1)'
        ];

        // datasets 생성
        const datasets = counties.map((county, idx) => ({
          label: county,
          data: grouped[county].map(item => item.price),
          borderColor: colors[idx % colors.length],
          backgroundColor: colors[idx % colors.length],
          fill: false,
          tension: 0.1,
        }));

        setChartData({ labels, datasets });

        // 기존 nationalData, localData도 복구
        const processedData = items
          .filter((item) => item.countyname !== '평년')
          .map((item) => ({
            date: `${item.yyyy}-${item.regday.replace('/', '-')}`,
            price: Number(item.price.replace(/,/g, '')),
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setNationalData(processedData);
        setLocalData(processedData.filter((d) => d.price > 20000));
      } catch (error: any) {
        setChartData({ labels: [], datasets: [] });
        setNationalData([]);
        setLocalData([]);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchPriceData();
    }
  }, [keyword, startDate, endDate]);

  // 아래 차트용 별도 useEffect
  useEffect(() => {
    const fetchRegionApiData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get('/api/near-region/price/by-region', {
          params: { itemName: keyword, countryCode: '', startDate: formatDateToYYYYMMDD(startDate) },
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = response.data.result;
        console.log('[near-region/price/by-region 응답]', items);
        setRegionApiData(items);

        // 데이터 가공
        const regionRows = items.filter(
          (row: any) => !["평균", "최저값", "최고값", "등락률"].includes(row.countyName)
        );
        const labels = ["1년전", "1개월전", "1주전", "현재"];
        const colors = [
          'rgba(255,99,132,1)', 'rgba(54,162,235,1)', 'rgba(255,206,86,1)',
          'rgba(75,192,192,1)', 'rgba(153,102,255,1)', 'rgba(255,159,64,1)'
        ];
        const datasets = regionRows.map((row: any, idx: number) => ({
          label: row.countyName,
          data: [
            Number((row.yearprice || '0').replace(/,/g, "")),
            Number((row.monthprice || '0').replace(/,/g, "")),
            Number((row.weekprice || '0').replace(/,/g, "")),
            Number((row.price || '0').replace(/,/g, "")),
          ],
          borderColor: colors[idx % colors.length],
          backgroundColor: colors[idx % colors.length],
          fill: false,
          tension: 0.1,
        }));
        setRegionChartData({ labels, datasets });
      } catch (e) {
        setRegionChartData({ labels: [], datasets: [] });
      }
    };
    fetchRegionApiData();
  }, [keyword, startDate]);

  const handleSearch = () => {
    if (input.trim()) {
      setKeyword(input.trim());
    }
  };
  return (
    <div className="wholesale-page-container">
      <header className="wholesale-header">
        <button className="hamburger-menu">☰</button>
        <div className="logo-container">🌱</div>
      </header>

      <div className="search-bar-container" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={input}
            onChange={e => setInput(e.target.value)}
            className="search-input"
            style={{ width: '100%' }}
          >
            <option value="">품목을 선택하세요</option>
            {itemList.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="date-input"
            style={{ flex: 1, minWidth: 110, maxWidth: 140 }}
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="date-input"
            style={{ flex: 1, minWidth: 110, maxWidth: 140 }}
          />
          <button onClick={handleSearch} className="search-button" style={{ minWidth: 44, fontSize: 22 }}>
            🔍
          </button>
        </div>
      </div>

      <PriceChart
        title={`${keyword} 도매가격 지역별 비교`}
        subtitle="날짜별 도매가격 (지역별 선그래프)"
        data={chartData}
        loading={loading}
      />

      <div className="notification-bar">
        <span>원하는 시세(원)</span>
        <div className="bell-icon">🔔</div>
      </div>

      <PriceChart
        title={`지역별 ${keyword} 도매가격 비교`}
        subtitle="현재, 1주전, 1개월전, 1년전 가격"
        data={regionChartData}
        loading={false}
      />
    </div>
  );
};

export default WholesalePricePage;
