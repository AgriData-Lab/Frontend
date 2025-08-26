import React, { useState } from "react";
import Sidebar from "../../components/common/SideBar.tsx";
import Header from "../../components/common/Header.tsx";

const PAGE_MAX = 398;   // Header와 동일
const HEADER_H = 48;    // Header 높이

const SomaeMarketPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  return (
    <div
    className="page-somae"
      style={{
        minHeight: "100vh",
        background: "#EEE", // 전체 배경(카드 외부)
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isOpen={isSidebarOpen}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main
        style={{
          flex: 1,
          paddingTop: HEADER_H,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* ✅ 카드: 헤더와 동일 가로폭 + 세로 전체 */}
        <div
          style={{
            width: "100%",
            maxWidth: showMap ? 768 : 430,   // ✅ 지도일 때 더 넓게
            height: "100vh",        // 세로 전체
            background: "#FFF6F3",  // 카드 배경색
            border: "1px solid #eee",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            padding: 16,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 14,                 // ✅ 요소 간 기본 간격(제목-이미지-버튼 사이)
          }}
        >
          <h2
            style={{
              fontSize: 20,
              margin: "6px 0 4px",   // 살짝만 띄우기(여백은 gap이 담당)
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            🛒 서울시 소매시장 밀도
          </h2>

          {!showMap ? (
            <>
              <img
                src="/somae_instruction.png"
                alt="소매시장 Choropleth 설명"
                style={{
                    width: "calc(100% + 32px)",  // 카드 좌우 padding(16px+16px)을 포함
                    marginLeft: -16,             // 왼쪽 padding 덮기
                    marginRight: -16,            // 오른쪽 padding 덮기
                    height: "50vh",   
                    objectFit: "contain",
                    borderRadius: 0,             // 테두리까지 꽉 차게 → 둥근 모서리 제거
                    borderBottom: "1px solid #e5e5e5", // 아래쪽 구분선만 주고 싶을 때
                    display: "block",
                    marginTop: 8,
                    marginBottom: 12,
                }}
               />
              <button
                onClick={() => setShowMap(true)}
                style={{
                  background: "#B6D8F2",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 20px",
                  cursor: "pointer",
                  marginTop: 2,        // 버튼과 이미지 사이 추가 여백은 gap이 기본 제공
                }}
              >
                📍 자세히 보기 (지도)
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowMap(false)}
                style={{
                  background: "#2F80ED",
                  color: "#fff",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                  marginTop: 4,
                }}
              >
                ← 뒤로가기
              </button>
              <iframe
                title="seoul_somae_markets_choropleth"
                src="/seoul_somae_markets_choropleth.html"
                style={{
                  width: "100%",
                  flex: 1,              // 남는 세로 공간 꽉 채움
                  border: "none",
                  borderRadius: 16,
                }}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SomaeMarketPage;
