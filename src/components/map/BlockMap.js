// import React from 'react';
// import './BlockMap.css';

// // 시도별 샘플 색상 (base RGB)
// const regionBaseColor = {
//   서울: '245,190,190',
//   경기: '245,224,190',
//   인천: '245,238,190',
//   강원: '224,245,190',
//   충청: '190,245,224',
//   전라: '190,190,245',
//   경상: '224,190,245',
//   제주: '245,190,224',
// };
// // 모든 지역이 같은 연핑크 baseColor
// // const regionBaseColor = {
// //   서울: '245,190,190',
// //   경기: '245,190,190',
// //   인천: '245,190,190',
// //   강원: '245,190,190',
// //   충청: '245,190,190',
// //   전라: '245,190,190',
// //   경상: '245,190,190',
// //   제주: '245,190,190',
// // };

// // 예시 데이터: 각 지역별 개수
// const regionData = {
//   서울: 1,
//   경기: 30,
//   인천: 5,
//   강원: 15,
//   충청: 8,
//   전라: 20,
//   경상: 25,
//   제주: 2,
// };

// // 진하기 계산 함수 (min~max → 0.3~1.0)
// function getOpacity(count, min, max) {
//   if (max === min) return 1;
//   return 0.3 + 0.7 * ((count - min) / (max - min));
// }

// const counts = Object.values(regionData);
// const min = Math.min(...counts);
// const max = Math.max(...counts);

// const BlockMap = () => {
//   return (
//     <div className="blockmap-container" style={{alignItems: 'center'}}>
//       <div className="blockmap-header">
//         <button className="blockmap-tab">유통시설 분포</button>
//         <button className="blockmap-tab blockmap-tab-active">전국 시세 분포</button>
//         <button className="blockmap-tab">기본</button>
//       </div>
//       <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
//         <svg viewBox="0 0 300 400" width="90%" height="auto" style={{maxWidth: 350, background: '#fff6f3', borderRadius: 24}}>
//           {/* 서울 */}
//           <rect x="130" y="70" width="40" height="40" fill={`rgba(${regionBaseColor['서울']},${getOpacity(regionData['서울'], min, max)})`} stroke="#333" rx="8" />
//           <text x="150" y="95" textAnchor="middle" fontSize="15" fill="#333">서울</text>
//           {/* 경기 */}
//           <rect x="110" y="110" width="80" height="50" fill={`rgba(${regionBaseColor['경기']},${getOpacity(regionData['경기'], min, max)})`} stroke="#333" rx="10" />
//           <text x="150" y="140" textAnchor="middle" fontSize="15" fill="#333">경기</text>
//           {/* 인천 */}
//           <rect x="80" y="110" width="30" height="30" fill={`rgba(${regionBaseColor['인천']},${getOpacity(regionData['인천'], min, max)})`} stroke="#333" rx="7" />
//           <text x="95" y="130" textAnchor="middle" fontSize="13" fill="#333">인천</text>
//           {/* 강원 */}
//           <rect x="200" y="80" width="50" height="80" fill={`rgba(${regionBaseColor['강원']},${getOpacity(regionData['강원'], min, max)})`} stroke="#333" rx="12" />
//           <text x="225" y="120" textAnchor="middle" fontSize="14" fill="#333">강원</text>
//           {/* 충청 */}
//           <rect x="120" y="170" width="60" height="50" fill={`rgba(${regionBaseColor['충청']},${getOpacity(regionData['충청'], min, max)})`} stroke="#333" rx="10" />
//           <text x="150" y="200" textAnchor="middle" fontSize="14" fill="#333">충청</text>
//           {/* 전라 */}
//           <rect x="100" y="230" width="60" height="60" fill={`rgba(${regionBaseColor['전라']},${getOpacity(regionData['전라'], min, max)})`} stroke="#333" rx="12" />
//           <text x="130" y="265" textAnchor="middle" fontSize="14" fill="#333">전라</text>
//           {/* 경상 */}
//           <rect x="180" y="210" width="70" height="80" fill={`rgba(${regionBaseColor['경상']},${getOpacity(regionData['경상'], min, max)})`} stroke="#333" rx="14" />
//           <text x="215" y="255" textAnchor="middle" fontSize="14" fill="#333">경상</text>
//           {/* 제주 */}
//           <rect x="140" y="320" width="40" height="30" fill={`rgba(${regionBaseColor['제주']},${getOpacity(regionData['제주'], min, max)})`} stroke="#333" rx="10" />
//           <text x="160" y="340" textAnchor="middle" fontSize="13" fill="#333">제주</text>
//         </svg>
//       </div>
//     </div>
//   );
// };

// export default BlockMap; 
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

// 시군 → 시도로 매핑
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

// 투명도 계산
const getOpacity = (value, min, max) => {
  if (max === min) return 1;
  return 0.3 + 0.7 * ((value - min) / (max - min));
};

const BlockMap = () => {
  const [regionData, setRegionData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");  // 저장된 토큰 불러오기
  
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const currentDate = `${yyyy}${mm}${dd}`;

    axios.get('/api/prices-distribution/hipping-periods', {
      params: {
        itemName: '사과',
        startDate: currentDate
      },
      headers: {
        Authorization: `Bearer ${token}`  // 헤더에 토큰 추가
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
    <div className="blockmap-container" style={{ alignItems: 'center' }}>
      <div className="blockmap-header">
        <button className="blockmap-tab">유통시설 분포</button>
        <button className="blockmap-tab blockmap-tab-active">전국 시세 분포</button>
        <button className="blockmap-tab">기본</button>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <svg viewBox="0 0 300 400" width="90%" height="auto" style={{ maxWidth: 350, background: '#fff6f3', borderRadius: 24 }}>
          {/* 서울 */}
          <rect x="130" y="70" width="40" height="40" fill={getColor('서울')} stroke="#333" rx="8" />
          <text x="150" y="95" textAnchor="middle" fontSize="15" fill="#333">서울</text>
          {/* 경기 */}
          <rect x="110" y="110" width="80" height="50" fill={getColor('경기')} stroke="#333" rx="10" />
          <text x="150" y="140" textAnchor="middle" fontSize="15" fill="#333">경기</text>
          {/* 인천 */}
          <rect x="80" y="110" width="30" height="30" fill={getColor('인천')} stroke="#333" rx="7" />
          <text x="95" y="130" textAnchor="middle" fontSize="13" fill="#333">인천</text>
          {/* 강원 */}
          <rect x="200" y="80" width="50" height="80" fill={getColor('강원')} stroke="#333" rx="12" />
          <text x="225" y="120" textAnchor="middle" fontSize="14" fill="#333">강원</text>
          {/* 충청 */}
          <rect x="120" y="170" width="60" height="50" fill={getColor('충청')} stroke="#333" rx="10" />
          <text x="150" y="200" textAnchor="middle" fontSize="14" fill="#333">충청</text>
          {/* 전라 */}
          <rect x="100" y="230" width="60" height="60" fill={getColor('전라')} stroke="#333" rx="12" />
          <text x="130" y="265" textAnchor="middle" fontSize="14" fill="#333">전라</text>
          {/* 경상 */}
          <rect x="180" y="210" width="70" height="80" fill={getColor('경상')} stroke="#333" rx="14" />
          <text x="215" y="255" textAnchor="middle" fontSize="14" fill="#333">경상</text>
          {/* 제주 */}
          <rect x="140" y="320" width="40" height="30" fill={getColor('제주')} stroke="#333" rx="10" />
          <text x="160" y="340" textAnchor="middle" fontSize="13" fill="#333">제주</text>
        </svg>
      </div>
    </div>
  );
};

export default BlockMap;
