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
    if (!localForm.countyCode || !localForm.interestItem) {
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
          <div style={{
            position: "relative",
            overflow: "visible",     // ✅ 드롭다운이 잘릴 경우 반드시 필요
            zIndex: 1                 // ✅ 겹치는 요소보다 위에 있도록
          }}>
            <select
              name="countyCode"
              value={localForm.countyCode}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "18px 14px",
                fontSize: 16,
                border: "1px solid #bbb",
                borderRadius: 8,
                background: "#FFF8F3",
                appearance: "none",   // 기본 브라우저 화살표 제거 (선택)
                WebkitAppearance: "none",
                MozAppearance: "none"
              }}
            >
              <option value="">지역을 선택하세요</option>
              <option value="서울">서울</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="인천">인천</option>
              <option value="광주">광주</option>
              <option value="대전">대전</option>
              <option value="울산">울산</option>
              <option value="수원">수원</option>
              <option value="강릉">강릉</option>
              <option value="춘천">춘천</option>
              <option value="청주">청주</option>
              <option value="전주">전주</option>
              <option value="포항">포항</option>
              <option value="제주">제주</option>
              <option value="의정부">의정부</option>
              <option value="순천">순천</option>
              <option value="안동">안동</option>
              <option value="창원">창원</option>
              <option value="용인">용인</option>
              <option value="세종">세종</option>
              <option value="성남">성남</option>
              <option value="고양">고양</option>
              <option value="천안">천안</option>
              <option value="김해">김해</option>
            </select>

            {/* 선택적으로 오른쪽에 아이콘 배치 */}
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
          <div style={{ position: "relative", overflow: "visible", zIndex: 1 }}>
            <select
              name="interestItem"
              value={localForm.interestItem}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "18px 14px",
                fontSize: 16,
                border: "1px solid #bbb",
                borderRadius: 8,
                background: "#FFF8F3",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none"
              }}
            >
              <option value="">관심 품목을 선택하세요</option>
              <option value="쌀">쌀</option>
              <option value="찹쌀">찹쌀</option>
              <option value="혼합곡">혼합곡</option>
              <option value="기장">기장</option>
              <option value="콩">콩</option>
              <option value="팥">팥</option>
              <option value="녹두">녹두</option>
              <option value="메밀">메밀</option>
              <option value="고구마">고구마</option>
              <option value="감자">감자</option>
              <option value="귀리">귀리</option>
              <option value="보리">보리</option>
              <option value="수수Q">수수Q</option>
              <option value="율무">율무</option>
              <option value="배추">배추</option>
              <option value="양배추">양배추</option>
              <option value="시금치">시금치</option>
              <option value="상추">상추</option>
              <option value="얼갈이배추">얼갈이배추</option>
              <option value="갓">갓</option>
              <option value="연근">연근</option>
              <option value="우엉">우엉</option>
              <option value="수박">수박</option>
              <option value="참외">참외</option>
              <option value="오이">오이</option>
              <option value="호박">호박</option>
              <option value="토마토">토마토</option>
              <option value="딸기">딸기</option>
              <option value="무">무</option>
              <option value="당근">당근</option>
              <option value="열무">열무</option>
              <option value="건고추">건고추</option>
              <option value="">관심 품목을 선택하세요</option>
              <option value="풋고추">풋고추</option>
              <option value="붉은고추">붉은고추</option>
              <option value="피마늘">피마늘</option>
              <option value="양파">양파</option>
              <option value="파">파</option>
              <option value="생강">생강</option>
              <option value="고춧가루">고춧가루</option>
              <option value="가지">가지</option>
              <option value="미나리">미나리</option>
              <option value="깻잎">깻잎</option>
              <option value="부추">부추</option>
              <option value="피망">피망</option>
              <option value="파프리카">파프리카</option>
              <option value="멜론">멜론</option>
              <option value="깐마늘(국산)">깐마늘(국산)</option>
              <option value="깐마늘(수입)">깐마늘(수입)</option>
              <option value="브로콜리">브로콜리</option>
              <option value="양상추">양상추</option>
              <option value="청경채">청경채</option>
              <option value="케일">케일</option>
              <option value="콩나물">콩나물</option>
              <option value="절임배추">절임배추</option>
              <option value="쑥">쑥</option>
              <option value="달래">달래</option>
              <option value="두릅">두릅</option>
              <option value="로메인 상추">로메인 상추</option>
              <option value="취나물">취나물</option>
              <option value="쥬키니호박">쥬키니호박</option>
              <option value="청양고추">청양고추</option>
              <option value="대파">대파</option>
              <option value="고사리">고사리</option>
              <option value="쪽파">쪽파</option>
              <option value="다발무">다발무</option>
              <option value="겨울 배추">겨울 배추</option>
              <option value="알배기배추">알배기배추</option>
              <option value="방울토마토">방울토마토</option>
              <option value="참깨">참깨</option>
              <option value="들깨">들깨</option>
              <option value="땅콩">땅콩</option>
              <option value="느타리버섯">느타리버섯</option>
              <option value="팽이버섯">팽이버섯</option>
              <option value="새송이버섯">새송이버섯</option>
              <option value="호두">호두</option>
              <option value="아몬드">아몬드</option>
              <option value="양송이버섯">양송이버섯</option>
              <option value="표고버섯">표고버섯</option>
              <option value="더덕">더덕</option>
              <option value="사과">사과</option>
              <option value="배">배</option>
              <option value="복숭아">복숭아</option>
              <option value="포도">포도</option>
              <option value="감귤">감귤</option>
              <option value="단감">단감</option>
              <option value="바나나">바나나</option>
              <option value="참다래">참다래</option>
              <option value="파인애플">파인애플</option>
              <option value="오렌지">오렌지</option>
              <option value="자몽">자몽</option>
              <option value="레몬">레몬</option>
              <option value="체리">체리</option>
              <option value="건포도">건포도</option>
              <option value="건블루베리">건블루베리</option>
              <option value="망고">망고</option>
              <option value="블루베리">블루베리</option>
              <option value="아보카도">아보카도</option>
              <option value="레드향">레드향</option>
              <option value="매실">매실</option>
              <option value="무화과">무화과</option>
              <option value="복분자">복분자</option>
              <option value="샤인머스켓">샤인머스켓</option>
              <option value="곶감">곶감</option>
              <option value="골드키위">골드키위</option>
              <option value="고등어">고등어</option>
              <option value="꽁치">꽁치</option>
              <option value="갈치">갈치</option>
              <option value="조기">조기</option>
              <option value="명태">명태</option>
              <option value="삼치">삼치</option>
              <option value="물오징어">물오징어</option>
              <option value="건멸치">건멸치</option>
              <option value="북어">북어</option>
              <option value="건오징어">건오징어</option>
              <option value="김">김</option>
              <option value="건미역">건미역</option>
              <option value="굴">굴</option>
              <option value="수입조기">수입조기</option>
              <option value="새우젓">새우젓</option>
              <option value="멸치액젓">멸치액젓</option>
              <option value="굵은소금">굵은소금</option>
              <option value="전복">전복</option>
              <option value="새우">새우</option>
              <option value="주꾸미">주꾸미</option>
              <option value="꽃게">꽃게</option>
              <option value="참조기">참조기</option>
              <option value="홍합">홍합</option>
              <option value="가리비">가리비</option>
              <option value="건다시마">건다시마</option>
            </select>

            {/* 선택 아이콘 */}
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
