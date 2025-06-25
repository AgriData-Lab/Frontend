import React from 'react';

const FacilityMapPage = () => {
  const handleMapOpen = () => {
    window.open('/distribution_facilities_ratio_map.html', '_blank');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8F6F5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '48px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#FFF6F3',
          borderRadius: 24,
          boxShadow: '0 2px 8px #0001',
          padding: '48px 32px 32px 32px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          minHeight: '80vh',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          🧭 지역별 유통시설 분포
        </h2>

        {/* 🔹 이미지 */}
        <img
          src="/blockMap_ratio.png"
          alt="블록맵"
          style={{
            width: '100%',
            height: 'auto',
            border: '1px solid #ccc',
            borderRadius: 12,
            objectFit: 'cover',
          }}
        />

        {/* 🔹 버튼 */}
        <button
          onClick={handleMapOpen}
          style={{
            marginTop: 24,
            background: '#F5BEBE',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18,
            border: 'none',
            borderRadius: 12,
            padding: '14px 0',
            cursor: 'pointer',
          }}
        >
          📍 자세히 보기 (지도)
        </button>
      </div>
    </div>
  );
};

export default FacilityMapPage;
