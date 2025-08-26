import React, { useMemo, useState } from "react";
import { ExternalLink, FolderOpen, ArrowLeft } from "lucide-react";
import Sidebar from "../components/common/SideBar.tsx";
import Header from "../components/common/Header.tsx";

const RESOURCES = [
  {
    title: "서울농부포털 (도시농업)",
    url: "https://cityfarmer.seoul.go.kr/?act=main",
    description: "서울시 도시농업 대표 포털",
    tags: ["서울", "도시농업", "포털"],
    image: "🌱",
  },
  {
    title: "서울시 농업기술센터",
    url: "https://agro.seoul.go.kr/",
    description: "도시농업·치유농업 교육·서비스 신청 및 공지사항",
    tags: ["서울", "농업기술센터", "교육", "치유농업"],
    image: "🌿",
  },
  {
    title: "자치구별 도시농업지원센터",
    url: "https://news.seoul.go.kr/economy/archives/547356",
    description: "서울시 자치구별 도시농업지원센터 리스트",
    tags: ["서울", "도시농업지원센터", "자치구"],
    image: "🏢",
  },
  {
    title: "서울시 도시농업 교육·체험 신청",
    url: "https://cityfarmer.seoul.go.kr/ntcn/www/list.do?key=1905228760770&ntcnSeCode=NGC001",
    description: "서울시 도시농업 교육 및 체험 프로그램 신청",
    tags: ["서울", "도시농업", "교육", "체험"],
    image: "🎓",
  },
  {
    title: "서울도시농업 교육·서비스 신청",
    url: "https://agro.seoul.go.kr/archives/category/eduexperience_c1/education-and-experience-news",
    description: "서울시 농업기술센터의 교육·서비스 신청 안내",
    tags: ["서울", "농업기술센터", "교육", "서비스"],
    image: "📋",
  },
];

// 스타일 모음 객체 (S) 정의 끝난 뒤
const tagBtn = (active = false): React.CSSProperties => ({
  padding: "6px 10px",
  borderRadius: 999,
  border: `1px solid ${active ? "#6b6eff" : "#e5e7eb"}`,
  background: active ? "#eef0ff" : "#fff",
  cursor: "pointer",
  fontSize: 12,
});

const uniq = (arr: string[]) => Array.from(new Set(arr));

export default function ResourceDirectoryNarrow() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("전체");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const allTags = useMemo(
    () => ["전체", ...uniq(RESOURCES.flatMap((r) => r.tags))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      const byTag = tag === "전체" || r.tags.includes(tag);
      const byQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.join(" ").toLowerCase().includes(q);
      return byTag && byQuery;
    });
  }, [query, tag]);

  const openAllFiltered = () => {
    filtered.forEach((r, i) => {
      setTimeout(
        () => window.open(r.url, "_blank", "noopener,noreferrer"),
        120 * i
      );
    });
  };

  const S: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100dvh",
      background: "#f2f5f0",
      display: "flex",
      flexDirection: "column",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    },
    cardWrap: {
      flex: 1,
      display: "grid",
      placeItems: "center",
      padding: 16,
      boxSizing: "border-box",
    },
    card: {
      width: 430,
      maxWidth: "100%",
      background: "#fff6f3",
      // height: 800,
      height: "95%",  
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
      overflow: "hidden",
      border: "1px solid #e9ecef",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      padding: "14px 16px",
      borderBottom: "1px solid #eef1f4",
      display: "flex",
      alignItems: "center",
      gap: 8,
      flex: "0 0 auto",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: 800,
      letterSpacing: 0.2,
    },
    body: {
      padding: 16,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      gap: 12,
    },
    inputWrap: { display: "flex", gap: 8, marginBottom: 10 },
    input: {
      flex: 1,
      minWidth: 0,
      padding: "10px 12px",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      fontSize: 14,
      outline: "none",
    },
    tagRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 },
    list: { display: "flex", flexDirection: "column", gap: 10 },
    item: {
      border: "1px solid #eef1f4",
      borderRadius: 14,
      padding: 12,
      display: "grid",
      gridTemplateColumns: "48px 1fr",
      gap: 10,
      alignItems: "center",
      background: "#fafbfc",
    },
    iconBox: {
      width: 48,
      height: 48,
      display: "grid",
      placeItems: "center",
      borderRadius: 12,
      background: "#f3f5f7",
      fontSize: 24,
    },
    title: { fontSize: 15, fontWeight: 700, margin: 0 },
    desc: { fontSize: 12, opacity: 0.8, margin: 0 },
    badgeRow: { marginTop: 6 },
    badge: {
      display: "inline-block",
      padding: "3px 8px",
      borderRadius: 999,
      background: "#eef1f4",
      fontSize: 11,
      marginRight: 6,
      marginBottom: 4,
    },
    footerBar: {
      padding: 12,
      borderTop: "1px solid #eef1f4",
      display: "flex",
      gap: 8,
      flex: "0 0 auto",
    },
    btn: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      background: "#fff",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontWeight: 600,
    },
    btnPrimary: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid #6b6eff",
      background: "#6b6eff",
      color: "#fff",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontWeight: 700,
    },
  } as const;

  return (
    <div style={S.page}>
      {/* 🔹 상단바 */}
      <Header
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isOpen={isSidebarOpen}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 🔹 본문 카드 */}
      <div style={S.cardWrap}>
        <div style={S.card}>
          {/* 카드 헤더 */}
          <div style={S.header}>
            <button
              onClick={() => window.history.back()}
              style={{ background: "none", border: 0, cursor: "pointer" }}
              aria-label="뒤로가기"
            >
              <ArrowLeft size={18} />
            </button>
            <div style={S.headerTitle}>안내 링크</div>
            <div style={{ width: 18 }} />
          </div>

          {/* 카드 본문 */}
          <div style={S.body}>
            <div style={S.inputWrap}>
              <input
                placeholder="검색: 기관명 / 주제 / 지역 ..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={S.input}
              />
            </div>

            <div style={S.tagRow}>
              {allTags.map((t) => (
                <button
                  key={t}
                  style={tagBtn(t === tag)}
                  onClick={() => setTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={S.list}>
              {filtered.map((r) => (
                <div key={r.title} style={S.item}>
                  <div style={S.iconBox}>{r.image ?? "🔗"}</div>
                  <div>
                    <h3 style={S.title}>{r.title}</h3>
                    <p style={S.desc}>{r.description}</p>
                    <div style={S.badgeRow}>
                      {r.tags.map((t) => (
                        <span key={t} style={S.badge}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button style={S.btnPrimary}>
                          <ExternalLink size={16} /> 바로가기
                        </button>
                      </a>
                      {r.official && (
                        <a
                          href={r.official.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button style={S.btn}>{r.official.label}</button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 카드 하단 */}
          <div style={S.footerBar}>
            <button style={S.btn} onClick={openAllFiltered}>
              <FolderOpen size={16} /> 전체 열기 ({filtered.length})
            </button>
            <a
              href="https://forms.gle/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1 }}
            >
              <button style={S.btn}>새 링크 제안</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
