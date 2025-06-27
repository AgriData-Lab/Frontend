import React, { useState } from 'react';
import Sidebar from '../../components/common/SideBar.tsx';
import Header from '../../components/common/Header.tsx';

const FacilityMapPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMapOpen = () => {
    window.open('/distribution_facilities_ratio_map.html', '_blank');
  };

  return (
    <div
      className="mobile-container"
      style={{
        minHeight: '100vh',
        background: '#FFF6F3', // 전체 배경 흰색 계열
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 🔹 상단바 */}
      <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />

      {/* 🔹 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 🔹 본문 전체 영역 사용 */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 16px',
          boxSizing: 'border-box',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.5rem' }}>
          🧭 지역별 유통시설 분포
        </h2>

        <img
          src="/blockMap_ratio.png"
          alt="블록맵"
          style={{
            width: '100%',
            maxWidth: '640px', // 최대 넓이 제한 (원하면 제거 가능)
            border: '1px solid #ccc',
            borderRadius: 16,
            objectFit: 'contain',
            marginTop: '32px',   // 🔽 여기 추가
            marginBottom: '24px',
          }}
        />

        <button
          onClick={handleMapOpen}
          style={{
            background: '#F5BEBE',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18,
            border: 'none',
            borderRadius: 12,
            padding: '14px 32px',
            cursor: 'pointer',
            marginTop: '32px',  // 🔽 여기 추가
          }}
        >
          📍 자세히 보기 (지도)
        </button>
      </main>
    </div>
  );
};

export default FacilityMapPage;
