import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BlockMap.css';

const regionBaseColor = {
  서울: '245,190,190',
  경기: '245,224,190',
  인천: '245,238,190',
  강원: '224,245,190',
  충청: '190,245,224',
  전라: '190,190,245',
  경상: '224,190,245',
  제주: '245,190,224',
};

const countyToRegion = (county) => {
  if (county.includes("서울")) return "서울";
  if (county.includes("부산") || county.includes("대구") || county.includes("울산") || county.includes("경상")) return "경상";
  if (county.includes("광주") || county.includes("전라")) return "전라";
  if (county.includes("대전") || county.includes("세종") || county.includes("충청")) return "충청";
  if (county.includes("경기")) return "경기";
  if (county.includes("인천")) return "인천";
  if (county.includes("강원")) return "강원";
  if (county.includes("제주")) return "제주";
  return null;
};

const getOpacity = (value, min, max) => {
  if (max === min) return 1;
  return 0.3 + 0.7 * ((value - min) / (max - min));
};

const BlockMap = () => {
  const [regionData, setRegionData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const currentDate = `${yyyy}${mm}${dd}`;

    axios.get('/api/prices-distribution/hipping-periods', {
      params: {
        startDate: currentDate
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      const rawList = res.data.result;
      const priceMap = {};
      rawList.forEach(({ countyname, price }) => {
        const region = countyToRegion(countyname);
        if (!region) return;
        const p = parseInt(price.replace(/,/g, ''), 10);
        priceMap[region] = Math.max(priceMap[region] || 0, p);
      });
      setRegionData(priceMap);
    })
    .catch((err) => {
      console.error('💥 전국 시세 데이터 불러오기 실패:', err);
    });
  }, []);

  const values = Object.values(regionData);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const getColor = (region) => {
    const value = regionData[region];
    const opacity = value ? getOpacity(value, min, max) : 0.3;
    return `rgba(${regionBaseColor[region]},${opacity})`;
  };

  return (
    <div className="blockmap-container">
      <div className="blockmap-header">
        <button className="blockmap-tab">유통시설 분포</button>
        <button className="blockmap-tab blockmap-tab-active">전국 시세 분포</button>
        <button className="blockmap-tab">기본</button>
      </div>

      <div className="blockmap-svg-wrapper">
            <svg viewBox="0 0 500 700" className="blockmap-svg">
        {/* 인천 */}
        <circle cx="120" cy="120" r="40" fill={getColor('인천')} stroke="#333" />
        <text x="120" y="125" textAnchor="middle" fontSize="14" fill="#333">인천</text>

        {/* 서울 */}
        <circle cx="205" cy="105" r="35" fill={getColor('서울')} stroke="#333" />
        <text x="205" y="110" textAnchor="middle" fontSize="14" fill="#333">서울</text>

        {/* 경기 */}
        <circle cx="210" cy="185" r="45" fill={getColor('경기')} stroke="#333" />
        <text x="210" y="190" textAnchor="middle" fontSize="14" fill="#333">경기</text>

        {/* 강원 */}
        <circle cx="325" cy="115" r="45" fill={getColor('강원')} stroke="#333" />
        <text x="325" y="120" textAnchor="middle" fontSize="14" fill="#333">강원</text>

        {/* 충청 */}
        <circle cx="205" cy="285" r="40" fill={getColor('충청')} stroke="#333" />
        <text x="205" y="290" textAnchor="middle" fontSize="14" fill="#333">충청</text>

        {/* 전라 */}
        <circle cx="110" cy="385" r="40" fill={getColor('전라')} stroke="#333" />
        <text x="110" y="390" textAnchor="middle" fontSize="14" fill="#333">전라</text>

        {/* 경상 */}
        <circle cx="310" cy="385" r="45" fill={getColor('경상')} stroke="#333" />
        <text x="310" y="390" textAnchor="middle" fontSize="14" fill="#333">경상</text>

        {/* 제주 */}
        <circle cx="225" cy="495" r="35" fill={getColor('제주')} stroke="#333" />
        <text x="225" y="500" textAnchor="middle" fontSize="13" fill="#333">제주</text>
      </svg>
      </div>
    </div>
  );
};

export default BlockMap;
