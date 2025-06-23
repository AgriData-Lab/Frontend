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
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
};

const WholesalePricePage = () => {
  const [keyword, setKeyword] = useState('사과');
  const [input, setInput] = useState('');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] } as ChartDataType);
  const [loading, setLoading] = useState(false);
  const [nationalData, setNationalData] = useState([] as ChartData[]);
  const [localData, setLocalData] = useState([] as ChartData[]);

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

        const { startDate, endDate } = getDateRange();

        const response: AxiosResponse<ApiResponse<ShippingData[]>> = await axios.get(
          `/api/shipping-periods`,
          {
            params: {
              itemName: keyword,
              countryCode: '',
              startDate,
              endDate,
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
  }, [keyword]);

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

      <div className="search-bar-container">
       <input
        type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="검색어를 입력하세요 ex) 오이, 원예, 허브"
        className="search-input"
          />
     <button onClick={handleSearch} className="search-button">
      🔍
     </button>
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

      {/* 아래에 기존 빈 차트 복구 */}
      <PriceChart
        title={`인접 지역 ${keyword} 출하시기`}
        subtitle="연도별 평균 도매가격 (단가 기준 필터링)"
        data={{ labels: [], datasets: [] }}
        loading={false}
      />
    </div>
  );
};

export default WholesalePricePage;
