import React, { useState } from "react";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import axios from "../../api/axiosInstance";

const containerStyle = {
  width: "100%",
  maxWidth: 400,
  minWidth: 0,
  background: "#FFF6F3",
  borderRadius: 24,
  boxShadow: "0 2px 8px #0001",
  padding: "48px 32px 32px 32px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: "80vh" // ★★★ 모바일 웹에서 자주 사용! 전체 화면의 80% 차지하는 높이게끔 
};

function SignupForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordCheck: "",
    region: "",
    interestItem: ""
  });

  // 1단계 완료 → 2단계로
  const handleNext = (data) => {
    setForm({ ...form, ...data });
    setStep(1);
  };

  // 2단계 완료 → 회원가입 제출
  const handleSubmit = async (data) => {
    const finalForm = { ...form, ...data };
    try {
      await axios.post("/users/auth/signup", finalForm);
      alert("회원가입 성공!");
      // 초기화 또는 이동
    } catch (err) {
      alert("회원가입 실패: " + err.response?.data?.message);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8F6F5",
      display: "flex",
      justifyContent: "center",
      // alignItems: "center" ❌ 이것이 모든 콘텐츠를 수직 가운데 정렬
      alignItems: "flex-start", // ★★★ ✅ 상단 정렬
      paddingTop: "48px"        // ★★★ ✅ 여유 있게 띄움

    }}>
      <div style={containerStyle}>
        {step === 0 ? (
          <SignupStep1
            form={form}
            onNext={handleNext}
          />
        ) : (
          <SignupStep2
            form={form}
            onBack={() => setStep(0)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default SignupForm;
