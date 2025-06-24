import React, { useState } from "react";

function SignupStep1({ form, onNext }) {
  const [localForm, setLocalForm] = useState(form);

  const handleChange = (e) => {
    setLocalForm({ ...localForm, [e.target.name]: e.target.value });
  };

  const handleCheckDuplicate = (type) => {
    alert(`${type === "name" ? "닉네임" : "아이디"} 중복확인 기능은 구현 필요`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localForm.name || !localForm.email || !localForm.password || !localForm.passwordCheck) {
      alert("모든 필드를 입력하세요.");
      return;
    }
    if (localForm.password !== localForm.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    onNext(localForm);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "80vh"
      }}
    >
      {/* 상단 타이틀 */}
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 22,
          marginBottom: 12
        }}
      >
        회원 가입
      </div>

      {/* 상단 구분선 */}
      <div style={{
        width: "100%",
        height: "1px",
        backgroundColor: "#F5BEBE",
        marginBottom: 24
      }} />

      {/* 입력 필드 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32
        }}
      >
        {/* 닉네임 */}
        <div>
          <label style={{ fontWeight: "bold" }}>닉네임</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              name="name"
              placeholder="닉네임을 입력해 주세요."
              value={localForm.name}
              onChange={handleChange}
              style={{
                flex: 1,
                border: "none",
                borderBottom: "1px solid #ccc",
                padding: 8,
                background: "transparent"
              }}
            />
            <button
              type="button"
              onClick={() => handleCheckDuplicate("name")}
              style={{
                border: "1px solid #F5BEBE",
                background: "none",
                color: "#F5BEBE",
                borderRadius: 8,
                padding: "4px 12px",
                fontSize: 14
              }}
            >
              중복 확인
            </button>
          </div>
        </div>

        {/* 아이디 */}
        <div>
          <label style={{ fontWeight: "bold" }}>아이디</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              name="email"
              placeholder="사용할 이메일을 입력해 주세요."
              value={localForm.email}
              onChange={handleChange}
              style={{
                flex: 1,
                border: "none",
                borderBottom: "1px solid #ccc",
                padding: 8,
                background: "transparent"
              }}
            />
            <button
              type="button"
              onClick={() => handleCheckDuplicate("id")}
              style={{
                border: "1px solid #F5BEBE",
                background: "none",
                color: "#F5BEBE",
                borderRadius: 8,
                padding: "4px 12px",
                fontSize: 14
              }}
            >
              중복 확인
            </button>
          </div>
        </div>

        {/* 비밀번호 */}
        <div>
          <label style={{ fontWeight: "bold" }}>비밀번호</label>
          <input
            name="password"
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            value={localForm.password}
            onChange={handleChange}
            style={{
              width: "95%",
              border: "none",
              borderBottom: "1px solid #ccc",
              padding: 8,
              background: "transparent",
              marginBottom: 8
            }}
          />
          <input
            name="passwordCheck"
            type="password"
            placeholder="비밀번호 확인"
            value={localForm.passwordCheck}
            onChange={handleChange}
            style={{
              width: "95%",
              border: "none",
              borderBottom: "1px solid #ccc",
              padding: 8,
              background: "transparent"
            }}
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{ marginTop: 24 }}>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px 0",
            background: "#F5BEBE",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: 12,
            fontSize: 18
          }}
        >
          다음
        </button>
      </div>
    </form>
  );
}

export default SignupStep1;
