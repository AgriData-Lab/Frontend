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

const WholesalePricePage = () => {
  const [keyword, setKeyword] = useState('사과'); // 기본 관심 품목 -> 추후 수정
  const [input, setInput] = useState('');
  const [nationalData, setNationalData] = useState([] as ChartData[]);
  const [localData, setLocalData] = useState([] as ChartData[]);
  const [loading, setLoading] = useState(false);

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
              countryCode: '1101',
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
          console.warn('⚠️ 예상과 다른 응답 구조:', response.data);
          setNationalData([]);
          setLocalData([]);
          return;
        }

        const processedData = items
          .filter((item) => item.countyname !== '평년') // 평년 제외
          .map((item) => ({
            date: `${item.yyyy}-${item.regday.replace('/', '-')}`,
            price: Number(item.price.replace(/,/g, '')),
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setNationalData(processedData);
        setLocalData(processedData.filter((d) => d.price > 20000));
      } catch (error) {
        console.error('가격 데이터 조회 실패:', error);
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
        title={`전국 ${keyword} 출하시기`}
        subtitle="연도별 평균 도매가격"
        data={nationalData}
        loading={loading}
      />

      <div className="notification-bar">
        <span>원하는 시세(원)</span>
        <div className="bell-icon">🔔</div>
      </div>

      <PriceChart
        title={`인접 지역 ${keyword} 출하시기`}
        subtitle="연도별 평균 도매가격 (단가 기준 필터링)"
        data={localData}
        loading={loading}
      />
    </div>
  );
};

export default WholesalePricePage;
