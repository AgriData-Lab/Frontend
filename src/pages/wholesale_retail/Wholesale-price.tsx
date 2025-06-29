import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

import PriceChart from '../../components/charts/PriceChart.tsx';
import './Wholesale-price.css';
import Sidebar from '../../components/common/SideBar.tsx';

// API 응답 데이터 타입 정의
interface ShippingData {
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

type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
};

const WholesalePricePage = () => {
  const [keyword, setKeyword] = useState('사과');
  const [input, setInput] = useState('사과');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] } as ChartDataType);
  const [loading, setLoading] = useState(false);
  const [nationalData, setNationalData] = useState<{ date: string; price: number }[]>([]);
  const [localData, setLocalData] = useState<{ date: string; price: number }[]>([]);
  const [regionApiData, setRegionApiData] = useState([]);
  const [regionChartData, setRegionChartData] = useState({ labels: [], datasets: [] } as ChartDataType);
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [itemList, setItemList] = useState<string[]>([]);
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
    return sessionStorage.getItem('hasShownTodayPopup') === getTodayStr();
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
  useEffect(() => {
    const fetchInterestItem = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('/users/prefer-item', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const interest = res.data?.result;
        if (interest) {
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
    if (itemList.length > 0 && !itemList.includes(keyword)) {
      setKeyword('사과');
      setInput('사과');
    }
  }, [itemList, keyword]);

  // 날짜를 yyyy-MM-dd -> yyyyMMdd로 변환하는 함수
  function formatDateToYYYYMMDD(dateStr: string) {
    return dateStr.replace(/-/g, '');
  }

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

        const response: AxiosResponse<ApiResponse<ShippingData[]>> = await axios.get(
          `/api/shipping-periods`,
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

        // 지역별로 그룹화
        const grouped: { [county: string]: ChartData[] } = {};
        items
          .filter((item) => item.countyname !== '평년')
          .forEach((item) => {
            const date = `${item.yyyy}-${item.regday.replace('/', '-')}`;
            const price = Number(item.price.replace(/,/g, ''));
            if (!grouped[item.countyname]) grouped[item.countyname] = [];
            grouped[item.countyname].push({ date, price });
          });

        // 모든 날짜(라벨) 추출 (서울 기준)
        const counties = Object.keys(grouped);
        const labels = grouped[counties[0]]?.map(item => item.date) || [];

        // 색상 배열
        const colors = [
          'rgba(255,99,132,1)', 'rgba(54,162,235,1)', 'rgba(255,206,86,1)',
          'rgba(75,192,192,1)', 'rgba(153,102,255,1)', 'rgba(255,159,64,1)'
        ];

        // datasets 생성
        const datasets = counties.map((county, idx) => ({
          label: county,
          data: grouped[county].map(item => item.price),
          borderColor: colors[idx % colors.length],
          backgroundColor: colors[idx % colors.length],
          fill: false,
          tension: 0.1,
        }));

        setChartData({ labels, datasets });

        // 기존 nationalData, localData도 복구
        const processedData = items
          .filter((item) => item.countyname !== '평년')
          .map((item) => ({
            date: `${item.yyyy}-${item.regday.replace('/', '-')}`,
            price: Number(item.price.replace(/,/g, '')),
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setNationalData(processedData);
        setLocalData(processedData.filter((d) => d.price > 20000));
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

  // 아래 차트용 별도 useEffect
  useEffect(() => {
    const fetchRegionApiData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get('/api/near-region/price/by-region', {
          params: { itemName: keyword, countryCode: '', startDate: formatDateToYYYYMMDD(startDate) },
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = response.data.result;
        console.log('[near-region/price/by-region 응답]', items);
        setRegionApiData(items);

        // 데이터 가공
        const regionRows = items.filter(
          (row: any) => !["평균", "최저값", "최고값", "등락률"].includes(row.countyName)
        );
        const labels = ["1년전", "1개월전", "1주전", "현재"];
        const colors = [
          'rgba(255,99,132,1)', 'rgba(54,162,235,1)', 'rgba(255,206,86,1)',
          'rgba(75,192,192,1)', 'rgba(153,102,255,1)', 'rgba(255,159,64,1)'
        ];
        const datasets = regionRows.map((row: any, idx: number) => ({
          label: row.countyName,
          data: [
            Number((row.yearprice || '0').replace(/,/g, "")),
            Number((row.monthprice || '0').replace(/,/g, "")),
            Number((row.weekprice || '0').replace(/,/g, "")),
            Number((row.price || '0').replace(/,/g, "")),
          ],
          borderColor: colors[idx % colors.length],
          backgroundColor: colors[idx % colors.length],
          fill: false,
          tension: 0.1,
        }));
        setRegionChartData({ labels, datasets });
      } catch (e) {
        setRegionChartData({ labels: [], datasets: [] });
      }
    };
    fetchRegionApiData();
  }, [keyword, startDate]);

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
        type: '도매',
        isActive: true,
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
        // 오늘 날짜에 해당하는 알림만 필터
        const today = getTodayStr();
        const todayNotices = result.filter((n: any) => n.triggeredAt?.startsWith(today));
        setAllTodayNotices(todayNotices);
        // 이미 보여준 알림은 제외
        const newNotices = todayNotices.filter((n: any) => !shownNotificationIds.includes(`${n.notificationId}_${n.triggeredAt}`));
        if (newNotices.length > 0 && !hasShownTodayPopup) {
          setPendingNotices(newNotices.map((n: any) => n.message));
          setShownNotificationIds(ids => [...ids, ...newNotices.map((n: any) => `${n.notificationId}_${n.triggeredAt}`)]);
          setHasShownTodayPopup(true);
          sessionStorage.setItem('hasShownTodayPopup', today); // 오늘 날짜로 기록
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
    sessionStorage.setItem('hasShownTodayPopup', getTodayStr()); // 종 아이콘 뱃지도 동일하게 관리
  };

  return (
    <div className="mobile-container">
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
            {allTodayNotices.length > 0 && !hasCheckedTodayNotice && sessionStorage.getItem('hasShownTodayPopup') !== getTodayStr() && (
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
          <button onClick={handleSearch} className="search-button" style={{ minWidth: 44, fontSize: 22 }}>
            🔍
          </button>
        </div>
      </div>

      <PriceChart
        title={
          <span>
                 <span style={{ color: '#9966CC', fontWeight: 'bold' }}>{keyword}</span> 도매가격 지역별 비교
            </span>
        }
      
        subtitle="날짜별 도매가격 (지역별 선그래프)"
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
               1년간 <span 지역별 style={{ color: '#9966CC', fontWeight: 'bold' }}>{keyword}</span> 도매가격 추이
          </span>
      }
      
        subtitle="현재, 1주전, 1개월전, 1년전 가격"
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
export default WholesalePricePage;