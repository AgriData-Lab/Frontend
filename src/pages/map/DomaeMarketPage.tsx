import React, { useState } from "react";
import Sidebar from "../../components/common/SideBar.tsx";
import Header from "../../components/common/Header.tsx";

const PAGE_MAX = 398;   // Header와 동일
const HEADER_H = 48;    // Header 높이
const TOP_GAP = 16;

const DomaeMarketPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  return (
    <div
    className="page-domae"
      style={{
        minHeight: "100vh",
        background: "#F6FFF6",         // 페이지(카드 바깥) 배경
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
        {/* 카드: 헤더와 동일 가로폭 + 세로 전체 */}
        <div
          style={{
            width: "100%",
            maxWidth: showMap ? 768 : 430,   // ✅ 지도일 때 더 넓게
            height: "100vh",
            background: "#FFF6F3",       // 카드 배경
            borderRadius: "0 0 20px 20px", // 상단 직각, 하단만 둥글게
            border: "1px solid #eee",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            padding: 16,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              margin: "6px 0 4px",
              fontWeight: 800,
              textAlign: "left",
            }}
          >
            📦 서울시 도매시장 위치
          </h2>

          {!showMap ? (
            <>
              {/* 이미지 래퍼: 카드 패딩 덮고, 세로 50vh 확보 */}
              <div
                style={{
                  width: "calc(100% + 32px)", // 좌/우 padding(16px) 보정
                  marginLeft: -16,
                  marginRight: -16,
                  height: "50vh",             // 화면 높이의 절반
                  borderRadius: "0",          // 상단을 카드와 일체감
                  overflow: "hidden",
                  borderBottom: "1px solid #e5e5e5",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/domae_instruction.png"
                  alt="도매시장 지도 설명"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  onClick={() => setShowMap(true)}
                  style={{
                    background: "#C7E8C8",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 20px",
                    cursor: "pointer",
                  }}
                >
                  📍 자세히 보기 (지도)
                </button>
              </div>
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

              {/* 지도 영역: 남는 세로 공간 전부 사용 */}
              <div
                style={{
                  width: "100%",
                  flex: 1,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #e5e5e5",
                }}
              >
                <iframe
                  title="seoul_domae_markets_with_true_outline"
                  src="/seoul_domae_markets_with_true_outline.html"
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DomaeMarketPage;
