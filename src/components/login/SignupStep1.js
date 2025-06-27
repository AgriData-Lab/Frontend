import React, { useState } from "react";
import axios from "axios";

function SignupStep1({ form, onNext }) {
  const [localForm, setLocalForm] = useState(form);
  const [isNameChecked, setIsNameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalForm({ ...localForm, [name]: value });

    // 입력이 바뀌면 다시 중복확인하도록 유도
    if (name === "name") setIsNameChecked(false);
    if (name === "email") setIsEmailChecked(false);
  };

  const handleCheckDuplicate = async (type) => {
    const value = type === "name" ? localForm.name : localForm.email;

    if (!value) {
      alert(`${type === "name" ? "닉네임" : "아이디"}를 입력해 주세요.`);
      return;
    }

    try {
      const response = await axios.get(`/users/auth/check-duplicate`, {
        params: { type, value: value.trim() }
      });

      console.log("백엔드 응답:", response.data);

      // ✅ 여기 중요: 백엔드 응답이 { result: true } 형태라면 이렇게
      const isDuplicate = response.data.result === true;

      if (isDuplicate) {
        alert(`이미 사용 중인 ${type === "name" ? "닉네임" : "아이디"}입니다.`);
        type === "name" ? setIsNameChecked(false) : setIsEmailChecked(false);
      } else {
        alert(`사용 가능한 ${type === "name" ? "닉네임" : "아이디"}입니다.`);
        type === "name" ? setIsNameChecked(true) : setIsEmailChecked(true);
      }
    } catch (error) {
      console.error(error);
      alert("중복 확인 중 오류가 발생했습니다.");
    }
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

    if (!isNameChecked || !isEmailChecked) {
      alert("닉네임과 아이디 중복 확인을 완료해주세요.");
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

      <div style={{
        width: "100%",
        height: "1px",
        backgroundColor: "#F5BEBE",
        marginBottom: 24
      }} />

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
          {isNameChecked && (
            <div style={{ color: "green", fontSize: 12, marginTop: 4 }}>
              ✅ 사용 가능한 닉네임입니다.
            </div>
          )}
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
              onClick={() => handleCheckDuplicate("email")}
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
          {isEmailChecked && (
            <div style={{ color: "green", fontSize: 12, marginTop: 4 }}>
              ✅ 사용 가능한 아이디입니다.
            </div>
          )}
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
