import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import type { ReactElement } from 'react';

const useCaseCategories = [
  {
    id: 'business',
    badge: 'BUSINESS',
    title: '비즈니스 & 창업',
    cases: [
      { icon: '📊', title: '시장 조사', desc: '딥리서치로 경쟁사 분석, 시장 규모 파악, 트렌드 리포트를 자동 수집하고 A/B/C 등급으로 분류합니다.' },
      { icon: '📝', title: '사업계획서 작성', desc: '7절 구조 프롬프트로 사업계획서 초안을 생성하고, 인용 근거가 붙은 시장 분석을 포함합니다.' },
      { icon: '🎬', title: 'IR Deck 제작', desc: '10슬라이드 원칙으로 IR Deck을 구성하고, Google Slides로 바로 내보냅니다.' },
      { icon: '💰', title: '단위경제 분석', desc: 'CAC/ARPU/LTV 시트를 작성하고 BM 캔버스 9칸을 인용 근거와 함께 완성합니다.' },
    ]
  },
  {
    id: 'research',
    badge: 'RESEARCH',
    title: '연구 & 학술',
    cases: [
      { icon: '📚', title: '문헌 검토', desc: '논문 PDF를 업로드하고 핵심 주장, 방법론, 한계점을 자동 추출합니다. 인용 번호로 원문 확인이 가능합니다.' },
      { icon: '🔬', title: '논문 작성 지원', desc: '수집한 자료를 바탕으로 연구 질문에 대한 답변을 생성하고, 모든 주장에 출처를 붙입니다.' },
      { icon: '🗂️', title: '자료 체계적 관리', desc: '프로젝트별 노트북으로 자료를 분류하고, 소스 간 관계를 마인드맵으로 시각화합니다.' },
      { icon: '🎙️', title: '연구 팟캐스트', desc: 'Audio Overview로 논문 내용을 대화형 팟캐스트로 변환하여 연구팀과 공유합니다.' },
    ]
  },
  {
    id: 'education',
    badge: 'EDUCATION',
    title: '교육 현장',
    cases: [
      { icon: '📋', title: '강의 노트 정리', desc: '강의 자료를 업로드하면 핵심 요약, 구조화된 노트, 복습 가이드를 자동 생성합니다.' },
      { icon: '❓', title: '퀴즈 & 시험 생성', desc: '교재를 기반으로 객관식/주관식 문제를 자동 생성하고 Google Forms로 내보냅니다.' },
      { icon: '🃏', title: '플래시카드 제작', desc: '핵심 용어와 개념을 플래시카드로 변환하여 반복 학습에 활용합니다.' },
      { icon: '🎥', title: '교육 콘텐츠 제작', desc: '교안을 5~10분 영상으로 변환하거나, 팟캐스트 형태의 복습 자료를 제작합니다.' },
    ]
  },
];

const realScenarios = [
  { title: '스타트업 A사: 투자 유치 준비', desc: '3일 만에 딥리서치로 시장 분석 → 페르소나 검증 → 사업계획서 7절 → IR Deck 10슬라이드 완성. A등급 소스 12개 인용.', result: '시드 투자 유치 성공' },
  { title: '대학 강의: 컴퓨팅 사고 과목', desc: '100페이지 교재를 업로드 → 매주 퀴즈 20문항 자동 생성 → Audio Overview로 복습 팟캐스트 제공.', result: '학생 만족도 4.7/5.0' },
  { title: '기업 마케팅팀: 경쟁사 분석', desc: '경쟁사 5곳의 웹사이트, 보도자료, 재무제표를 수집 → 비교 분석표 → SWOT → 전략 제안서.', result: '분석 시간 70% 단축' },
];

const navSections = [
  { id: 'business', label: '비즈니스 & 창업' },
  { id: 'research', label: '연구 & 학술' },
  { id: 'education', label: '교육 현장' },
  { id: 'scenarios', label: '실전 시나리오' },
];

const UseCases = (): ReactElement => {
  const [activeSection, setActiveSection] = useState('business');
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const setFadeRef = useCallback((el: HTMLElement | null) => {
    if (el && !fadeRefs.current.includes(el)) {
      fadeRefs.current.push(el);
    }
  }, []);

  const setSectionRef = useCallback((id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    fadeRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <SEOHead title="활용사례" description="NotebookLM 실전 활용 사례. 비즈니스, 연구, 교육 현장에서의 활용법." path="/use-cases" />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">USE CASES</span>
          <h1 className="page-title">활용사례</h1>
          <p className="page-description">NotebookLM을 실무에 적용하는 다양한 방법</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="page-sidebar-layout">
            {/* Left Sidebar */}
            <aside className="page-sidebar">
              <nav className="page-sidebar-nav">
                {navSections.map((s) => (
                  <button key={s.id} className={`nav-item${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>
                    <span className="nav-dot"></span>
                    {s.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Right Content */}
            <div className="page-main">
              {/* 분야별 활용 */}
              {useCaseCategories.map((cat) => (
                <div id={cat.id} key={cat.id} ref={setSectionRef(cat.id)} className="content-section">
                  <span className="content-section-badge">{cat.badge}</span>
                  <h2 className="content-section-title">{cat.title}</h2>
                  <div className="use-cases-grid">
                    {cat.cases.map((c, j) => (
                      <div className="use-case-card fade-in" key={j} ref={setFadeRef}>
                        <div className="use-case-icon">{c.icon}</div>
                        <h3>{c.title}</h3>
                        <p>{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* 실전 시나리오 */}
              <div id="scenarios" ref={setSectionRef('scenarios')} className="content-section">
                <span className="content-section-badge">REAL STORIES</span>
                <h2 className="content-section-title">실전 시나리오</h2>
                <p className="content-section-desc">NotebookLM을 활용한 실제 성과 사례</p>
                <div className="scenarios-grid">
                  {realScenarios.map((s, i) => (
                    <div className="scenario-card fade-in" key={i} ref={setFadeRef}>
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                      <div className="scenario-result">
                        <span className="result-badge">결과</span>
                        <span>{s.result}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cta-actions" style={{ marginTop: '32px', justifyContent: 'flex-start' }}>
                  <Link to="/consulting" className="btn btn-primary">교육 문의하기</Link>
                  <Link to="/curriculum" className="btn btn-outline">커리큘럼 보기</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UseCases;
