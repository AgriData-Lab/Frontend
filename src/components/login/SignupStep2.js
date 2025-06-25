import React, { useState } from "react";

// SVG 검색 아이콘
const SearchIcon = () => (
  <svg width="20" height="20" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);

function SignupStep2({ form, onBack, onSubmit }) {
  const [localForm, setLocalForm] = useState(form);

  const handleChange = (e) => {
    setLocalForm({ ...localForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localForm.region || !localForm.interestItem) {
      alert("지역과 관심 품목을 모두 입력하세요.");
      return;
    }
    onSubmit(localForm);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minHeight: "80vh"
    }}>
      {/* 상단 타이틀 */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <span
          style={{ fontSize: 28, marginRight: "auto", cursor: "pointer" }}
          onClick={onBack}
        >
          ←
        </span>
        <div style={{
          flex: 1,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 22
        }}>
          회원 가입
        </div>
        <span style={{ width: 28 }}></span>
      </div>

      {/* 구분선 */}
      <div style={{
        width: "100%",
        height: "1px",
        backgroundColor: "#F5BEBE",
        marginBottom: 24
      }} />

      {/* 입력 필드: 중앙 정렬 */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        {/* 지역 */}
        <div style={{ marginBottom: 40 }}>
          <label style={{ fontWeight: "bold", marginBottom: 12, display: "block" }}>
            1. 본인의 지역을 선택하세요.
          </label>
          <div style={{ position: "relative" }}>
            <input
              name="region"
              value={localForm.region}
              onChange={handleChange}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #bbb",
                borderRadius: 8,
                background: "#FFF8F3",
                padding: "18px 44px 18px 14px",
                fontSize: 16
              }}
            />
            <span style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)"
            }}>
              <SearchIcon />
            </span>
          </div>
        </div>

        {/* 관심 품목 */}
        <div style={{ marginBottom: 40 }}>
          <label style={{ fontWeight: "bold", marginBottom: 12, display: "block" }}>
            2. 관심있는 품목을 설정하세요.
          </label>
          <div style={{ position: "relative" }}>
            <input
              name="interestItem"
              value={localForm.interestItem}
              onChange={handleChange}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #bbb",
                borderRadius: 8,
                background: "#FFF8F3",
                padding: "18px 44px 18px 14px",
                fontSize: 16
              }}
            />
            <span style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)"
            }}>
              <SearchIcon />
            </span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ marginTop: 16 }}>
        <button type="submit"
          style={{
            width: "100%",
            padding: "14px 0",
            background: "#F5BEBE",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: 12,
            fontSize: 18
          }}>
          회원가입
        </button>
      </div>
    </form>
  );
}

export default SignupStep2;
