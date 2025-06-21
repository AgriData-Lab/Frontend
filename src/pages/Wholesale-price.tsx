import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
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

// 차트 데이터 타입 정의
interface ChartData {
  date: string;
  price: number;
}

// 차트 컴포넌트 (Placeholder)
const PriceChart = ({
  title,
  subtitle,
  data,
  loading,
}: {
  title: string;
  subtitle: string;
  data: ChartData[];
  loading: boolean;
}) => (
  <div className="chart-container">
    <h2 className="chart-title">{title}</h2>
    <p className="chart-subtitle">{subtitle}</p>
    <div className="chart-content">
      {loading ? <p>데이터 로딩 중...</p> : <p>차트가 여기에 표시됩니다.</p>}
    </div>
  </div>
);

const WholesalePricePage = () => {
  const [keyword, setKeyword] = useState('오이');
  const [input, setInput] = useState('');
  const [nationalData, setNationalData] = useState([] as ChartData[]);
  const [localData, setLocalData] = useState([] as ChartData[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPriceData = async () => {
      setLoading(true);
      try {
        const response: AxiosResponse<ShippingData[]> = await axios.get(
          `/api/shipping-periods?itemname=${keyword}`
        );

        const processedData = response.data
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
