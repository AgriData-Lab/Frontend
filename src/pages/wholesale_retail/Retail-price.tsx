import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import PriceChart from '../../components/charts/PriceChart.tsx';
import './Wholesale-price.css';

// API 응답 데이터 타입 정의 (Retail - 소매)
interface RetailData {
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

interface ChartDataType {
  labels: string[];
  datasets: {
    label: string;
    data: (number | null)[];  // 수정: null 허용
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

// ⛰️ 지역 → 권역 매핑
const countyToRegion: { [county: string]: string } = {
// 수도권
서울: "수도권", 인천: "수도권", 성남: "수도권", 수원: "수도권", 고양: "수도권", 용인: "수도권",
// 호서권(충청권)
대전: "호서권", 세종: "호서권", 청주: "호서권", 천안: "호서권",
// 호남권(전라도 쪽)
광주: "호남권", 전주: "호남권", 순천: "호남권",
// 영남권(경상도 쪽)
부산: "영남권", 대구: "영남권", 울산: "영남권", 포항: "영남권", 안동: "영남권", 창원: "영남권", 김해: "영남권",
// 관동권(강원도 쪽)
춘천: "관동권", 강릉: "관동권",
// 제주권(제주특별자치도)
제주: "제주권"
};


const RetailPricePage = () => {
  const [keyword, setKeyword] = useState<string>('사과'); // 타입 확실히 지정
  const [input, setInput] = useState<string>('사과'); // 타입 확실히 지정
  const [chartData, setChartData] = useState<ChartDataType>({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [nationalData, setNationalData] = useState<RetailData[]>([]); // RetailData 타입으로 수정
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

  // 날짜를 yyyy-MM-dd -> yyyyMMdd로 변환하는 함수
  function formatDateToYYYYMMDD(dateStr: string) {
    return dateStr.replace(/-/g, '');
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
  // 1️⃣ 상단그래프) 전국 품목 시세 조회 
  useEffect(() => {
    const fetchInterestItem = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const res = await axios.get('/users/prefer-item', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const interest = res.data?.result;

          // 🚫 이미 사용자가 검색했으면 초기 관심품목으로 덮어쓰지 않음
          if (interest && keyword === '사과' && input === '사과') {
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
      // itemList가 로딩된 후 keyword가 목록에 없을 경우만 경고 출력
      if (itemList.length > 0 && keyword && !itemList.includes(keyword)) {
        console.warn(`[Fallback] '${keyword}'는 품목 목록에 없습니다. '사과'로 대체합니다.`);
        // ❌ 자동으로 되돌리지 않고 사용자에게 안내만!
        // setKeyword('사과');
        // setInput('사과');
      }
    }, [itemList]);
  
    
  
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

            const response: AxiosResponse<ApiResponse<RetailData[]>> = await axios.get(
            `/retail/prices`,
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

            

            // ⛰️ 권역별로 그룹화
            const grouped: { [region: string]: ChartData[] } = {};
            items
            .filter((item) => item.countyname !== '평년')
            .forEach((item) => {
                const region = countyToRegion[item.countyname];
                if (!region) return; // 매핑 안된 지역은 제외

                const date = `${item.yyyy}-${item.regday.replace('/', '-')}`;
                const price = Number(item.price.replace(/,/g, ''));

                if (!grouped[region]) grouped[region] = [];
                grouped[region].push({ date, price });
            });

            // ✅ 라벨 추출 (가장 데이터가 많은 권역 기준)
            const regions = Object.keys(grouped);
            let labels = grouped[regions[0]]?.map(item => item.date) || [];

            // ✅ 날짜 오름차순 정렬 (YYYY-MM-DD 형식 기준)
            labels = labels.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());


            // ✅ 권역별 평균 데이터 생성
            const colors = [
            'rgba(255,99,132,1)',    // 수도권
            'rgba(54,162,235,1)',    // 호서권
            'rgba(255,206,86,1)',    // 호남권
            'rgba(75,192,192,1)',    // 영남권
            'rgba(153,102,255,1)',   // 관동권
            'rgba(102,255,102,1)',   // 제주권
            ];

            // datasets 생성
            const datasets = regions.map((region, idx) => {
            const priceMap = new Map<string, number[]>();

            // 날짜별로 price를 모음
            grouped[region].forEach(({ date, price }) => {
                if (!priceMap.has(date)) priceMap.set(date, []);
                priceMap.get(date)!.push(price);
            });

            // 날짜별 평균 계산
            const avgPrices = labels.map(date => {
                const prices = priceMap.get(date) || []; // 해당 날짜의 가격 목록 
                const sum = prices.reduce((a, b) => a + b, 0);
                return prices.length ? parseFloat((sum / prices.length).toFixed(0)) : null;
            });

            return {
                label: region,
                data: avgPrices,
                borderColor: colors[idx % colors.length],
                backgroundColor: colors[idx % colors.length],
                fill: false,
                tension: 0.1,
            };
            });

            setChartData({ labels, datasets });

            // 기존 nationalData, localData도 복구
            
            // ✅ RetailData[] 그대로 유지 → setNationalData
            const processedData = items.filter((item) => item.countyname !== '평년');
            setNationalData(processedData);

            // ✅ ChartData[]로 변환 → setLocalData
            const localChartData = processedData
            .map((item) => ({
                date: `${item.yyyy}-${item.regday.replace('/', '-')}`,
                price: Number(item.price.replace(/,/g, '')),
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setLocalData(localChartData.filter((d) => d.price > 20000));
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


    // 2️⃣ 하단 그래프) 인접 그래프 시세 조회 
    useEffect(() => {
    const fetchUserRegion = async () => {
        try {
        const token = localStorage.getItem('token');
        if (!token || nationalData.length === 0) return;

        const res = await axios.get('/users/region', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const userRegion = res.data?.result;

        const regionCounties = Object.entries(countyToRegion)
            .filter(([_, region]) => region === userRegion)
            .map(([county]) => county);

        // ⏬ 지역별 데이터 필터링
        const regionDataByCounty: { [county: string]: { date: string; price: number }[] } = {};
        regionCounties.forEach((county) => {
            regionDataByCounty[county] = nationalData
            .filter(item => item.countyname === county)
            .map(item => ({
                date: `${item.yyyy}-${item.regday.replace('/', '-')}`,
                price: Number(item.price.replace(/,/g, ''))
            }));
        });

        // ⏬ 모든 날짜 수집 (중복 제거)
        const allDates = Array.from(
            new Set(
            Object.values(regionDataByCounty)
                .flat()
                .map(entry => entry.date)
            )
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        // ⏬ 지역별 데이터셋 생성
        const datasets = regionCounties.map((county, idx) => {
            const dataMap = new Map(regionDataByCounty[county].map(entry => [entry.date, entry.price]));
            const data = allDates.map(date => dataMap.get(date) ?? null);

            return {
            label: county,
            data,
            borderColor: `rgba(${100 + idx * 30}, ${150 + idx * 20}, ${200 - idx * 15}, 1)`,
            backgroundColor: `rgba(${100 + idx * 30}, ${150 + idx * 20}, ${200 - idx * 15}, 0.2)`,
            fill: false,
            tension: 0.1,
            };
        });

        setRegionChartData({
            labels: allDates,
            datasets,
        });
        } catch (e) {
        console.error("권역 그래프 로딩 실패:", e);
        }
    };

    fetchUserRegion();
    }, [nationalData]);


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
            <button type="button" // 제출 타입으로 변경  
               onClick={handleSearch} className="search-button" style={{ minWidth: 44, fontSize: 22 }}>
              🔍
            </button>
          </div>
        </div>
  
        <PriceChart
          title={
            <span>
                전국 <span style={{ color: '#9966CC', fontWeight: 'bold' }}>{keyword}</span> 시세
            </span>
          }  
          subtitle="날짜별 전국 소매가격 (권역별 선그래프)"
          data={chartData}
          loading={loading}
        />
  
        <div className="notification-bar">
          <span>원하는 시세(원)</span>
          <div className="bell-icon">🔔</div>
        </div>
  
        <PriceChart
          title={
            <span>
                인접 지역 <span style={{ color: '#9966CC', fontWeight: 'bold' }}>{keyword}</span> 시세
            </span>
          }
          subtitle="날짜별 인접 지역 소매가격 (선그래프)"
          data={regionChartData}
          loading={false}
        />
      </div>
    );
  };

export default RetailPricePage;
