import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import PriceChart from '../../components/charts/PriceChart.tsx';
import './Wholesale-price.css';
import Sidebar from '../../components/common/SideBar.tsx';

// API 응답 데이터 타입 정의 (Retail - 소매)
interface RetailData {
  itemname: string;
  kindname: string;
  countyname: string;
  marketname: string;
  yyyy: string;
  regday: string;
  price: string;
}

// 전체 응답 타입 
interface ApiResponse<T> {
  code: string;
  message: string;
  result: T;
}

// 차트 데이터 타입 정의 
interface ChartData {
  date: string;
  price: number;
}

interface ChartDataType {
  labels: string[];
  datasets: {
    label: string;
    data: (number | null)[];  // 수정: null 허용
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

// ⛰️ 지역 → 권역 매핑
const countyToRegion: { [county: string]: string } = {
// 수도권
서울: "수도권", 인천: "수도권", 성남: "수도권", 수원: "수도권", 고양: "수도권", 용인: "수도권",
// 호서권(충청권)
대전: "호서권", 세종: "호서권", 청주: "호서권", 천안: "호서권",
// 호남권(전라도 쪽)
광주: "호남권", 전주: "호남권", 순천: "호남권",
// 영남권(경상도 쪽)
부산: "영남권", 대구: "영남권", 울산: "영남권", 포항: "영남권", 안동: "영남권", 창원: "영남권", 김해: "영남권",
// 관동권(강원도 쪽)
춘천: "관동권", 강릉: "관동권",
// 제주권(제주특별자치도)
제주: "제주권"
};

// 지역 코드 → 지역명
const codeToName: { [code: string]: string } = {
  "1101": "서울", "2100": "부산", "2200": "대구", "2300": "인천",
  "2401": "광주", "2501": "대전", "2601": "울산", "2701": "세종",
  "3111": "수원", "3112": "성남", "3113": "의정부", "3138": "고양", "3145": "용인",
  "3211": "춘천", "3214": "강릉", "3311": "청주", "3411": "천안",
  "3511": "전주", "3613": "순천", "3711": "포항", "3714": "안동",
  "3814": "창원", "3818": "김해", "3911": "제주"
};

// 🆕 name → code 매핑 객체 추가
const nameToCode: { [name: string]: string } = Object.fromEntries(
  Object.entries(codeToName).map(([code, name]) => [name, code])
);



// 📌 코드든 이름이든 다 처리하는 유틸
const getRegionFromCounty = (countyOrCode: string): string | undefined => {
  const name = codeToName[countyOrCode] ?? countyOrCode;
  return countyToRegion[name];
};


const RetailPricePage = () => {
  // 🔽 state 추가
  const [userCounty, setUserCounty] = useState<string>(''); // ex: "서울"
  const [userCountyCode, setUserCountyCode] = useState<string>(''); // ex: "1101"

  const [keyword, setKeyword] = useState<string>('사과'); // 타입 확실히 지정
  const [input, setInput] = useState<string>('사과'); // 타입 확실히 지정
  const [chartData, setChartData] = useState<ChartDataType>({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [nationalData, setNationalData] = useState<RetailData[]>([]); // RetailData 타입으로 수정
  const [localData, setLocalData] = useState<ChartData[]>([]); // 타입 지정
  const [regionApiData, setRegionApiData] = useState([]);
  const [regionChartData, setRegionChartData] = useState({ labels: [], datasets: [] } as ChartDataType);
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [itemList, setItemList] = useState<string[]>([]); // 제네릭 타입 지정
  const [notificationPrice, setNotificationPrice] = useState<number | null>(null);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [notificationMsgType, setNotificationMsgType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);
  const [shownNotificationIds, setShownNotificationIds] = useState<string[]>([]);
  const [pendingNotices, setPendingNotices] = useState<string[]>([]);
  const [allTodayNotices, setAllTodayNotices] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [hasShownTodayPopup, setHasShownTodayPopup] = useState(() => {
    // sessionStorage에 기록이 있으면 true, 없으면 false
    return sessionStorage.getItem('hasShownTodayPopup') === getAlertWindowDateStr();
  });
  const [hasCheckedTodayNotice, setHasCheckedTodayNotice] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  




  // 기본 날짜 유틸 함수 추가 
  function getDefaultStartDate() {
    const d = new Date();
    d.setDate(d.getDate() - 9);
    return d.toISOString().slice(0, 10);
  }

  function getDefaultEndDate() {
    return new Date().toISOString().slice(0, 10);
  }

  // 날짜를 yyyy-MM-dd -> yyyyMMdd로 변환하는 함수
  function formatDateToYYYYMMDD(dateStr: string) {
    return dateStr.replace(/-/g, '');
}

  // 현재 날짜 기준으로 날짜 계산 
  const getDateRange = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 14); // 14일 전 (2주)

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(today),
    };
  };

  // CSV에서 itemName만 추출 (최초 1회, fetch 사용)
  useEffect(() => {
    fetch('/items.csv')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').slice(1); // 첫 줄은 헤더 
        const names = lines
            .map(line => line.split(',')[2])
            .filter(Boolean);
        setItemList(names);
      });
  }, []);


  // 관심품목을 백엔드에서 받아와서 기본값으로 사용
  // 1️⃣ 상단그래프) 전국 품목 시세 조회 
  useEffect(() => {
    const fetchInterestItem = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const res = await axios.get('/users/prefer-item', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const interest = res.data?.result;

          // 🚫 이미 사용자가 검색했으면 초기 관심품목으로 덮어쓰지 않음
          if (interest && keyword === '사과' && input === '사과') {
            setKeyword(interest);
            setInput(interest);
          }
        } catch (e) {
          // 에러 시 무시하고 기본값(사과) 사용
        }
      };
      fetchInterestItem();
    }, []);
  
    // itemList가 로드된 후에도 관심품목이 목록에 없으면 fallback 처리
    useEffect(() => {
      // itemList가 로딩된 후 keyword가 목록에 없을 경우만 경고 출력
      if (itemList.length > 0 && keyword && !itemList.includes(keyword)) {
        console.warn(`[Fallback] '${keyword}'는 품목 목록에 없습니다. '사과'로 대체합니다.`);
        // ❌ 자동으로 되돌리지 않고 사용자에게 안내만!
        // setKeyword('사과');
        // setInput('사과');
      }
    }, [itemList]);
  
    
  
    useEffect(() => {
      const fetchPriceData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
            console.error('로그인이 필요합니다.');
            setLoading(false);
            return;
            }

            const response: AxiosResponse<ApiResponse<RetailData[]>> = await axios.get(
            `/retail/prices`,
            {
                params: {
                  itemName: keyword,
                  countryCode: '',
                  startDate: formatDateToYYYYMMDD(startDate),
                  endDate: formatDateToYYYYMMDD(endDate),
                },
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            );

            const items = response.data.result;
            if (!Array.isArray(items)) {
              setChartData({ labels: [], datasets: [] });
              setNationalData([]);
              setLocalData([]);
              return;
            }

            

            // ⛰️ 권역별로 그룹화
            const grouped: { [region: string]: ChartData[] } = {};
            items
            .filter((item) => item.countyname !== '평년')
            .forEach((item) => {
                const region = countyToRegion[item.countyname];
                if (!region) return; // 매핑 안된 지역은 제외

                const date = `${item.yyyy}-${item.regday.replace('/', '-')}`;
                const price = Number(item.price.replace(/,/g, ''));

                if (!grouped[region]) grouped[region] = [];
                grouped[region].push({ date, price });
            });

            // ✅ 라벨 추출 (가장 데이터가 많은 권역 기준)
            const regions = Object.keys(grouped);
            let labels = Array.from(
              new Set(grouped[regions[0]].map(item => item.date))
            ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());


            // ✅ 권역별 평균 데이터 생성
            const colors = [
            'rgba(255,99,132,1)',    // 수도권
            'rgba(54,162,235,1)',    // 호서권
            'rgba(255,206,86,1)',    // 호남권
            'rgba(75,192,192,1)',    // 영남권
            'rgba(153,102,255,1)',   // 관동권
            'rgba(102,255,102,1)',   // 제주권
            ];

            // datasets 생성
            const datasets = regions.map((region, idx) => {
            const priceMap = new Map<string, number[]>();

            // 날짜별로 price를 모음
            grouped[region].forEach(({ date, price }) => {
                if (!priceMap.has(date)) priceMap.set(date, []);
                priceMap.get(date)!.push(price);
            });

            // 날짜별 평균 계산
            const avgPrices = labels.map(date => {
                const prices = priceMap.get(date) || []; // 해당 날짜의 가격 목록 
                const sum = prices.reduce((a, b) => a + b, 0);
                return prices.length ? parseFloat((sum / prices.length).toFixed(0)) : null;
            });

            return {
                label: region,
                data: avgPrices,
                borderColor: colors[idx % colors.length],
                backgroundColor: colors[idx % colors.length],
                fill: false,
                tension: 0.1,
            };
            });

            setChartData({ labels, datasets });

            // 기존 nationalData, localData도 복구
            
            // ✅ RetailData[] 그대로 유지 → setNationalData
            const processedData = items.filter((item) => item.countyname !== '평년');
            setNationalData(processedData);

            // ✅ ChartData[]로 변환 → setLocalData
            const localChartData = processedData
            .map((item) => ({
                date: `${item.yyyy}-${item.regday.replace('/', '-')}`,
                price: Number(item.price.replace(/,/g, '')),
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setLocalData(localChartData.filter((d) => d.price > 20000));
            } catch (error: any) {
                setChartData({ labels: [], datasets: [] });
                setNationalData([]);
                setLocalData([]);
            } finally {
                setLoading(false);
            }

        };

  
        if (keyword) {
            fetchPriceData();
        }
    }, [keyword, startDate, endDate]);


    // 2️⃣ 하단 그래프) 인접 그래프 시세 조회 
    useEffect(() => {
    const fetchUserRegion = async () => {
        try {
        const token = localStorage.getItem('token');
        if (!token || nationalData.length === 0) return;

        const res = await axios.get('/users/region', {
            headers: { Authorization: `Bearer ${token}` },
        });

        // "지역" -> "권역권"으로 변환  ex) "서울" -> "수도권"
        
        const rawCountyCode = res.data.result;       // ex) '1101'
        const county = codeToName[rawCountyCode];    // ex) '서울'
        const userRegion = getRegionFromCounty(county);
        const countyCode = rawCountyCode;


        console.log('📍 사용자 지역명:', county);            // ex: 서울
        console.log('📍 매핑된 지역 코드:', countyCode);     // ex: 1101
        console.log('📍 매핑된 권역:', userRegion);          // ex: 수도권
        if (!countyCode) {
          console.warn(`❌ '${county}'는 nameToCode 매핑이 존재하지 않습니다.`);
          return;
        }


        if (!userRegion) {
          console.warn(`❌ '${userCounty}'는 권역 매핑이 존재하지 않습니다.`);
          return;
        }

        // ✅ 지역 정보 상태 설정
        setUserCounty(county);
        setUserCountyCode(countyCode);

        // 해당 권역에 속한 지역 목록 추출
        const regionCounties = Object.entries(countyToRegion)
            .filter(([_, region]) => region === userRegion)
            .map(([county]) => county);

        // ⏬ 지역별 데이터 필터링
        const regionDataByCounty: { [county: string]: { date: string; price: number }[] } = {};
        regionCounties.forEach((county) => {
            regionDataByCounty[county] = nationalData
            .filter(item => item.countyname === county)
            .map(item => ({
                date: `${item.yyyy}-${item.regday.replace('/', '-')}`,
                price: Number(item.price.replace(/,/g, ''))
            }));
        });

        // ⏬ 모든 날짜 수집 (중복 제거)
        const allDates = Array.from(
            new Set(
            Object.values(regionDataByCounty)
                .flat()
                .map(entry => entry.date)
            )
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const colorPalette = [
          '#e6194b', // 빨강
          '#3cb44b', // 초록
          '#ffe119', // 노랑
          '#4363d8', // 파랑
          '#f58231', // 주황
          '#911eb4', // 보라
          '#46f0f0', // 청록
          '#f032e6', // 분홍
          '#bcf60c', // 연두
          '#fabebe', // 살구
          '#008080', // 청회
          '#e6beff', // 연보라
        ];

        // ⏬ 지역별 데이터셋 생성
        const datasets = regionCounties.map((county, idx) => {
        const color = colorPalette[idx % colorPalette.length];  // overflow 대응
        const dataMap = new Map(regionDataByCounty[county].map(entry => [entry.date, entry.price]));
        const data = allDates.map(date => dataMap.get(date) ?? null);

        return {
          label: county,
          data,
          borderColor: color,
          backgroundColor: color + '33', // 20% 투명도
          fill: false,
          tension: 0.1,
        };
      });

        console.log('📍 지역별 날짜 수:', allDates.length);
        console.log('📍 지역별 데이터셋 수:', datasets.length);

        setRegionChartData({
            labels: allDates,
            datasets,
        });
        } catch (e) {
        console.error("권역 그래프 로딩 실패:", e);
        }

        
    };

    fetchUserRegion();
    }, [nationalData]);


    const handleSearch = () => {
        if (input.trim()) {
            setKeyword(input.trim());
        }
    };

  // 알림 등록 함수
  const handleRegisterNotification = async () => {
    if (!notificationPrice || notificationPrice <= 0) {
      setNotificationMsg('유효한 가격을 입력하세요.');
      setNotificationMsgType('error');
      setShowToast(true);
      return;
    }

    if (!userCountyCode) {
      setNotificationMsg('지역 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      setNotificationMsgType('error');
      setShowToast(true);
      return;
    }

    setNotificationLoading(true);
    setNotificationMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotificationMsg('로그인이 필요합니다.');
        setNotificationMsgType('error');
        setShowToast(true);
        setNotificationLoading(false);
        return;
      }

      await axios.post('/api/notifications/notifications', {
        itemName: keyword,
        targetPrice: notificationPrice,
        type: '소매',
        isActive: true,
        countyCode: userCountyCode,  // ✅ 정확한 필드명 사용
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotificationMsg('알림이 등록되었습니다!');
      setNotificationMsgType('success');
      setNotificationPrice(null);
      setShowToast(true);
    } catch (e: any) {
      setNotificationMsg('알림 등록 실패');
      setNotificationMsgType('error');
      setShowToast(true);
    } finally {
      setNotificationLoading(false);
    }
  };


  // 토스트 자동 닫기
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // 오늘 날짜 yyyy-MM-dd
  function getTodayStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  // 알림 기준 날짜 구하기: 17시~익일 16:59
  function getAlertWindowDateStr(): string {
    const now = new Date();
    const threshold = new Date();
    threshold.setHours(17, 0, 0, 0); // 오늘 17시

    if (now < threshold) {
      now.setDate(now.getDate() - 1);
    }
    return now.toISOString().slice(0, 10); // ex: "2025-07-03"
  }

  // 알림 시간 범위 체크 함수
  function isInCurrentAlertWindow(triggeredAtStr: string): boolean {
    const triggeredAt = new Date(triggeredAtStr);
    const now = new Date();

    const start = new Date(now);
    const end = new Date(now);

    if (now.getHours() >= 17) {
      start.setHours(17, 0, 0, 0);
      end.setDate(start.getDate() + 1);
      end.setHours(16, 59, 59, 999);
    } else {
      start.setDate(start.getDate() - 1);
      start.setHours(17, 0, 0, 0);
      end.setHours(16, 59, 59, 999);
    }

    return triggeredAt >= start && triggeredAt <= end;
  }


  // 페이지 진입 시 오늘 알림 조회 (최초 1회만)
  useEffect(() => {
    const fetchTodayNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = res.data?.result || [];

        // ✅ 변경: 알림 주기 기준으로 필터
        const todayNotices = result.filter((n: any) =>
          n.triggeredAt && isInCurrentAlertWindow(n.triggeredAt)
        );

        // 최신순 정렬
        todayNotices.sort((a: any, b: any) =>
          new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()
        );

        setAllTodayNotices(todayNotices);
        const newNotices = todayNotices.filter((n: any) =>
                !shownNotificationIds.includes(`${n.notificationId}_${n.triggeredAt}`)
              );

              if (newNotices.length > 0 && !hasShownTodayPopup) {
                setPendingNotices(newNotices.map((n: any) => n.message));
                setShownNotificationIds(ids =>
                  [...ids, ...newNotices.map((n: any) => `${n.notificationId}_${n.triggeredAt}`)]
                );
                setHasShownTodayPopup(true);
                sessionStorage.setItem('hasShownTodayPopup', getAlertWindowDateStr()); // ✅ 주기 기준 저장
              }
            } catch (e) {
              // 무시
            }
          };
    fetchTodayNotifications();
    // eslint-disable-next-line
  }, []);

  // pendingNotices가 있으면 순차 팝업 (최초 진입 1회만)
  useEffect(() => {
    if (pendingNotices.length > 0) {
      setNotificationMsg(pendingNotices[0]);
      setNotificationMsgType('success');
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setPendingNotices(notices => notices.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [pendingNotices]);

  // 알림 아이콘 클릭 시
  const handleOpenModal = () => {
    setShowModal(true);
    setHasCheckedTodayNotice(true);
    sessionStorage.setItem('hasShownTodayPopup', getAlertWindowDateStr()); // 종 아이콘 뱃지도 동일하게 관리
  };



    return (
      <div className="mobile-container" style={{ minHeight: '100vh', height: '100vh',  overflowY: isSidebarOpen ? 'hidden' : 'auto' }}>
        <header className="wholesale-header">
          <button className="hamburger-menu" onClick={toggleSidebar}>☰</button>
          <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="logo">🌱</span>
            <button
            onClick={handleOpenModal}
            style={{ background: 'none', border: 'none', marginLeft: 8, cursor: 'pointer', position: 'relative' }}
            aria-label="알림"
          >
            <span style={{ fontSize: 24 }}>🔔</span>
            {allTodayNotices.length > 0 && !hasCheckedTodayNotice && sessionStorage.getItem('hasShownTodayPopup') !== getAlertWindowDateStr() && (
              <span style={{ position: 'absolute', top: 2, right: 2, background: '#ff4b4b', color: '#fff', borderRadius: '50%', fontSize: 11, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{allTodayNotices.length}</span>
            )}
          </button>
          </div>
        </header>
  
        <div className="search-bar-container" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={input}
              onChange={e => setInput(e.target.value)}
              className="search-input"
              style={{ width: '100%' }}
            >
              <option value="">품목을 선택하세요</option>
              {itemList.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="date-input"
              style={{ flex: 1, minWidth: 110, maxWidth: 140 }}
            />
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="date-input"
              style={{ flex: 1, minWidth: 110, maxWidth: 140 }}
            />
            <button type="button" // 제출 타입으로 변경  
               onClick={handleSearch} className="search-button" style={{ minWidth: 44, fontSize: 22 }}>
              🔍
            </button>
          </div>
        </div>
  
        <PriceChart
          title={
            <span>
                전국 <span style={{ color: '#9966CC', fontWeight: 'bold' }}>{keyword}</span> 시세
            </span>
          }  
          subtitle="날짜별 전국 소매가격 (권역별 선그래프)"
          data={chartData}
          loading={loading}
        />
  
        <div className="notification-bar">
          <span>원하는 시세(원)</span>
          <input
            type="number"
            min="0"
            placeholder="가격 입력"
            value={notificationPrice || ''}
            onChange={e => setNotificationPrice(Number(e.target.value))}
            className="notification-input"
            style={{ width: 100, marginLeft: 8, marginRight: 8 }}
          />
          <button
            className="notification-register-btn"
            style={{ fontSize: 16, padding: '2px 10px', marginRight: 8 }}
            onClick={handleRegisterNotification}
            disabled={!notificationPrice || notificationLoading}
          >
            {notificationLoading ? '등록중...' : '등록'}
          </button>
        <div className="bell-icon">🔔</div>
      </div>

        {showToast && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '18px 32px',
            borderRadius: 16,
            fontSize: 17,
            zIndex: 9999,
            minWidth: 180,
            textAlign: 'center',
            boxShadow: '0 2px 12px #0003',
            fontWeight: 500,
          }}>
            {notificationMsg}
          </div>
        )}
  
        <PriceChart
          title={
            <span>
                인접 지역 <span style={{ color: '#9966CC', fontWeight: 'bold' }}>{keyword}</span> 시세
            </span>
          }
          subtitle="날짜별 인접 지역 소매가격 (선그래프)"
          data={regionChartData}
          loading={false}
        />

        {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: '28px 20px 20px 20px',
              minWidth: 260,
              maxWidth: 340,
              boxShadow: '0 2px 16px #0002',
              position: 'relative',
              textAlign: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>오늘의 알림</div>
            {allTodayNotices.length === 0 ? (
              <div style={{ color: '#888', fontSize: 15, padding: '24px 0' }}>오늘 알림 없음</div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: 260, overflowY: 'auto' }}>
                {allTodayNotices.map((n, i) => (
                  <li key={n.notificationId + '_' + n.triggeredAt} style={{ marginBottom: 16, textAlign: 'left', fontSize: 15, color: '#333', background: '#f8f6f5', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontWeight: 500 }}>
                      {n.itemName ? `[${n.itemName}] ` : ''}{n.message}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{n.triggeredAt}</div>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowModal(false)}
              style={{ marginTop: 18, background: '#ff4b4b', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
            >닫기</button>
          </div>
        </div>
      )}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />


      </div>
    );
  };

export default RetailPricePage;
