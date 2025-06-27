import React, { useState } from "react";
import axios from '../../api/axiosInstance';
import { useNavigate, Link } from "react-router-dom";

// 눈 아이콘 SVG
const EyeIcon = ({ visible, onClick }) => (
  <svg
    onClick={onClick}
    style={{ cursor: "pointer" }}
    width="24"
    height="24"
    fill="none"
    stroke="#bbb"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    {visible ? (
      <>
        <ellipse cx="12" cy="12" rx="8" ry="5" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ) : (
      <>
        <ellipse cx="12" cy="12" rx="8" ry="5" />
        <line x1="4" y1="20" x2="20" y2="4" />
      </>
    )}
  </svg>
);



function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "" });
  const [autoLogin, setAutoLogin] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/users/auth/signin", {
        email: form.id,
        password: form.password,
      });
      localStorage.setItem("token", res.data.result.token);
      alert("로그인 성공!");
      // 로그인 성공 후 기본맵 페이지로 이동
      navigate("/map"); 
    } catch (err) {
      alert("로그인 실패: " + err.response?.data?.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F6F5",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "48px"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#FFF6F3",
          borderRadius: 24,
          boxShadow: "0 2px 8px #0001",
          padding: "48px 32px 32px 32px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          minHeight: "80vh"
        }}
      >
        {/* 상단 바 & 타이틀 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 28, marginRight: "auto", cursor: "pointer" }}>←</span>
          <div style={{ flex: 1, textAlign: "center", fontWeight: "bold", fontSize: 22 }}>
            로그인
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

        {/* 입력 필드 중앙 */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24
        }}>
          {/* 아이디 */}
          <input
            name="id"
            placeholder="이메일"
            value={form.id}
            onChange={handleChange}
            style={{
              width: "100%",
              background: "#FFF8F3",
              boxSizing: "border-box",
              border: "1.5px solid #e9e3df",
              borderRadius: 12,
              padding: "18px 14px",
              fontSize: 16,
              outline: "none"
            }}
            autoFocus
          />

          {/* 비밀번호 */}
          <div style={{ position: "relative" }}>
            <input
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="비밀번호 (숫자, 영문 8~12자리)"
              value={form.password}
              onChange={handleChange}
              style={{
                width: "100%",
                background: "#FFF8F3",
                boxSizing: "border-box",
                border: "1.5px solid #e9e3df",
                borderRadius: 12,
                padding: "18px 44px 18px 14px",
                fontSize: 16,
                outline: "none"
              }}
            />
            <span style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)"
            }}>
              <EyeIcon visible={showPw} onClick={() => setShowPw((v) => !v)} />
            </span>
          </div>

          {/* 자동 로그인 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={autoLogin}
              onChange={() => setAutoLogin((v) => !v)}
              id="autoLogin"
              style={{
                accentColor: "#F5BEBE",
                width: 18,
                height: 18,
                marginRight: 8
              }}
            />
            <label htmlFor="autoLogin" style={{ fontSize: 16, color: "#333" }}>
              자동 로그인
            </label>
          </div>
        </div>

        {/* 하단 버튼 및 링크 */}
        <div style={{ marginTop: 24 }}>
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#F5BEBE",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 20,
              border: "none",
              borderRadius: 12,
              padding: "16px 0",
              cursor: "pointer",
              opacity: 0.9
            }}
          >
            로그인
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              color: "#b8b8b8",
              fontSize: 15,
              marginTop: 12
            }}
          >
            <Link to="/find-id" style={{ color: "#b8b8b8", textDecoration: "none" }}>
              아이디 찾기
            </Link>
            <span>|</span>
            <Link to="/find-password" style={{ color: "#b8b8b8", textDecoration: "none" }}>
              비밀번호 찾기
            </Link>
            <span>|</span>
            <Link to="/signup" style={{ color: "#b8b8b8", textDecoration: "none" }}>
              회원가입
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
