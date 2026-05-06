import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import type { ReactElement } from 'react';

/* ─── Data ─── */

const aboutCards = [
  { icon: '🎯', title: '인용 추적 시스템', desc: '답변 문장 끝에 작은 번호가 표시되고, 클릭하면 원본 소스의 정확한 위치로 이동합니다. 사업계획서나 IR Deck처럼 출처가 곧 신뢰인 문서를 만들 때 결정적입니다.' },
  { icon: '📑', title: '세 칸 인터페이스', desc: '왼쪽에 자료를 넣으면(소스), 가운데에서 그 자료에 대해 대화하고(채팅), 오른쪽에서 다양한 형태로 가공합니다(Studio). 이 흐름은 출시 이후 거의 그대로입니다.' },
  { icon: '🔗', title: 'Google 생태계 연동', desc: '같은 Google 계정, 같은 Drive, 같은 Docs로 묶여 있어 Gemini와의 분업이 매끄럽습니다. 구글 시트 내보내기, PPTX 변환이 두 클릭으로 끝납니다.' },
];

const steps: { num: number; title: string; desc?: string; items?: string[]; example?: string }[] = [
  {
    num: 1,
    title: '노트북 생성 & 소스 업로드',
    items: ['PDF, Word, PowerPoint, 텍스트', 'Google Docs, Google Slides', '웹사이트 URL, YouTube 영상', '직접 텍스트 입력'],
  },
  {
    num: 2,
    title: '채팅으로 질문하기',
    desc: '가운데 채팅 영역에서 자료에 대해 자유롭게 질문합니다. 모든 답변에 인용 번호가 붙습니다.',
    example: '"이 5개 회사의 가격 정책을 회사 · 요금제 · 월 가격 · 차별 조항으로 표를 만들어줘. 출처는 회사명 옆에 인용 번호로 표시해줘."',
  },
  {
    num: 3,
    title: 'Studio로 가공하기',
    desc: '오른쪽 Studio 패널에서 같은 자료를 다양한 형태로 가공합니다.',
    items: ['Audio Overview (한국어/영어 팟캐스트)', '슬라이드 자료 & 동영상 개요', '마인드맵 & 인포그래픽', '보고서 & 데이터 표', '퀴즈 & 플래시카드'],
  },
];

const targetAudience = [
  { icon: '🚀', label: '창업자 · 예비창업자', desc: '사업계획서, IR Deck, 시장 분석 보고서를 출처 기반으로 작성하고 싶은 분' },
  { icon: '🔬', label: '연구자 · 대학원생', desc: '논문 리뷰, 문헌 정리, 연구 노트를 체계적으로 관리하고 싶은 분' },
  { icon: '🎓', label: '학생 · 취업 준비생', desc: '강의 자료 정리, 시험 준비, 포트폴리오 구성에 AI를 활용하고 싶은 분' },
  { icon: '🏢', label: '기업 팀 · 실무자', desc: '회의록, 보고서, 경쟁사 분석 등 업무 문서를 빠르게 가공하고 싶은 분' },
];

const navSections = [
  { id: 'concept', label: '핵심 개념' },
  { id: 'differentiators', label: '3가지 차별점' },
  { id: 'how-to-use', label: '사용법 3단계' },
  { id: 'target', label: '추천 대상' },
  { id: 'comparison', label: 'AI 도구 비교' },
  { id: 'ecosystem', label: 'Google 생태계' },
];

/* ─── Component ─── */

const About = (): ReactElement => {
  const [activeSection, setActiveSection] = useState('concept');
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
      <SEOHead title="NotebookLM이란?" description="Google Gemini 기반 AI 리서치 도구 NotebookLM의 핵심 개념과 사용법을 알아보세요." path="/about" />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">ABOUT</span>
          <h1 className="page-title">NotebookLM이란?</h1>
          <p className="page-description">Google Gemini 기반의 AI 리서치 도구 — 내 자료만 학습하는 나만의 AI 비서</p>
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
              {/* 핵심 개념 */}
              <div id="concept" ref={setSectionRef('concept')} className="content-section">
                <span className="content-section-badge">CORE CONCEPT</span>
                <h2 className="content-section-title">내 자료만 근거로 답하는 AI</h2>
                <p className="content-section-desc">
                  NotebookLM은 구글이 Gemini 모델을 기반으로 만든 AI 리서치 도구입니다. 일반 챗봇과 달리 <strong>사용자가 업로드한 문서만을 바탕으로 답변을 생성</strong>합니다.
                </p>
                <p className="content-section-desc">
                  모든 답변에 인용 번호가 붙어 출처를 바로 확인할 수 있으며, 이것이 다른 AI 도구와의 결정적 차이입니다. ChatGPT, Claude 같은 범용 챗봇은 학습 데이터의 일반 지식으로 답하지만, NotebookLM은 <strong>사용자가 올린 자료만 근거로 답합니다</strong>.
                </p>
              </div>

              {/* 3가지 차별점 */}
              <div id="differentiators" ref={setSectionRef('differentiators')} className="content-section">
                <span className="content-section-badge">DIFFERENTIATORS</span>
                <h2 className="content-section-title">NotebookLM의 3가지 차별점</h2>
                <p className="content-section-desc">다른 AI 도구와 무엇이 다른가요?</p>
                <div className="about-grid about-grid-3">
                  {aboutCards.map((card, i) => (
                    <div className="about-card fade-in" key={i} ref={setFadeRef}>
                      <div className="about-icon">{card.icon}</div>
                      <h3>{card.title}</h3>
                      <p>{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 사용법 3단계 */}
              <div id="how-to-use" ref={setSectionRef('how-to-use')} className="content-section">
                <span className="content-section-badge">HOW TO USE</span>
                <h2 className="content-section-title">NotebookLM 사용법</h2>
                <p className="content-section-desc">소스 → 채팅 → Studio, 세 칸의 흐름을 기억하세요</p>
                <div className="steps-timeline">
                  {/* Step 1 */}
                  <div className="step fade-in" ref={setFadeRef}>
                    <div className="step-marker"><span>1</span></div>
                    <div className="step-content">
                      <h3>{steps[0].title}</h3>
                      <p><a href="https://notebooklm.google/" target="_blank" rel="noopener noreferrer">notebooklm.google</a>에서 새 노트북을 만들고 자료를 올립니다.</p>
                      <div className="step-details">
                        <div className="step-detail">
                          <strong>지원 소스 형식</strong>
                          <ul>{steps[0].items!.map((item, j) => <li key={j}>{item}</li>)}</ul>
                        </div>
                        <div className="step-tip">
                          <span className="tip-badge">핵심 원칙</span>
                          <p>노트북은 "주제" 단위가 아니라 <strong>"프로젝트" 단위</strong>로 만듭니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="step fade-in" ref={setFadeRef}>
                    <div className="step-marker"><span>2</span></div>
                    <div className="step-content">
                      <h3>{steps[1].title}</h3>
                      <p>{steps[1].desc}</p>
                      <div className="step-details">
                        <div className="step-example">
                          <span className="example-badge">좋은 질문 예시</span>
                          <p>{steps[1].example}</p>
                        </div>
                        <div className="step-tip">
                          <span className="tip-badge">TIP</span>
                          <p>답변을 핀 아이콘으로 저장하면 메모로 추가됩니다. 이 메모는 다시 <strong>소스로 변환</strong>해서 노트북이 점점 똑똑해지는 구조를 만들 수 있습니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="step fade-in" ref={setFadeRef}>
                    <div className="step-marker"><span>3</span></div>
                    <div className="step-content">
                      <h3>{steps[2].title}</h3>
                      <p>{steps[2].desc}</p>
                      <div className="step-details">
                        <div className="step-detail">
                          <strong>Studio 결과물</strong>
                          <ul>{steps[2].items!.map((item, j) => <li key={j}>{item}</li>)}</ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 추천 대상 */}
              <div id="target" ref={setSectionRef('target')} className="content-section">
                <span className="content-section-badge">FOR YOU</span>
                <h2 className="content-section-title">이런 분께 추천합니다</h2>
                <p className="content-section-desc">NotebookLM은 자료 기반 작업이 많은 모든 분에게 유용합니다</p>
                <div className="target-audience-grid">
                  {targetAudience.map((item, i) => (
                    <div className="target-card fade-in" key={i} ref={setFadeRef}>
                      <div className="target-icon">{item.icon}</div>
                      <h3>{item.label}</h3>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI 도구 비교 */}
              <div id="comparison" ref={setSectionRef('comparison')} className="content-section">
                <span className="content-section-badge">COMPARISON</span>
                <h2 className="content-section-title">NotebookLM vs 다른 AI 도구</h2>
                <p className="content-section-desc">핵심 차이를 한 눈에 비교하세요</p>
                <div className="comparison-table">
                  <div className="comp-row comp-header">
                    <span>항목</span>
                    <span>NotebookLM</span>
                    <span>ChatGPT / Claude</span>
                  </div>
                  <div className="comp-row">
                    <span>답변 근거</span>
                    <span>사용자 업로드 자료만</span>
                    <span>학습 데이터 전체</span>
                  </div>
                  <div className="comp-row comp-even">
                    <span>인용 표시</span>
                    <span>모든 문장에 인용 번호</span>
                    <span>없음 또는 제한적</span>
                  </div>
                  <div className="comp-row">
                    <span>환각(Hallucination)</span>
                    <span>매우 낮음 (소스 제한)</span>
                    <span>있을 수 있음</span>
                  </div>
                  <div className="comp-row comp-even">
                    <span>멀티모달 출력</span>
                    <span>팟캐스트, 영상, 슬라이드, 퀴즈</span>
                    <span>텍스트 중심</span>
                  </div>
                  <div className="comp-row">
                    <span>Google 생태계</span>
                    <span>완벽 연동 (Drive, Docs, Sheets)</span>
                    <span>제한적</span>
                  </div>
                  <div className="comp-row comp-even">
                    <span>협업</span>
                    <span>노트북 공유 + Audio 배포</span>
                    <span>대화 공유만 가능</span>
                  </div>
                </div>
              </div>

              {/* Google 생태계 */}
              <div id="ecosystem" ref={setSectionRef('ecosystem')} className="content-section">
                <span className="content-section-badge">ECOSYSTEM</span>
                <h2 className="content-section-title">Google 생태계 연동</h2>
                <p className="content-section-desc">같은 계정, 같은 Drive로 매끄러운 워크플로</p>
                <div className="about-grid about-grid-3">
                  <div className="about-card fade-in" ref={setFadeRef}>
                    <div className="about-icon">📂</div>
                    <h3>Google Drive</h3>
                    <p>Drive의 문서를 직접 소스로 추가. 별도 업로드 없이 기존 자료 활용.</p>
                  </div>
                  <div className="about-card fade-in" ref={setFadeRef}>
                    <div className="about-icon">📊</div>
                    <h3>Google Sheets</h3>
                    <p>데이터 표를 시트로 내보내기. 경쟁사 비교, 시장 분석 시트 바로 생성.</p>
                  </div>
                  <div className="about-card fade-in" ref={setFadeRef}>
                    <div className="about-icon">📽️</div>
                    <h3>Google Slides</h3>
                    <p>IR Deck과 발표자료를 Slides로 직접 내보내기. 편집부터 발표까지 한 흐름.</p>
                  </div>
                </div>

                <div className="cta-actions" style={{ marginTop: '32px', justifyContent: 'flex-start' }}>
                  <Link to="/curriculum" className="btn btn-primary">커리큘럼 보기</Link>
                  <Link to="/features" className="btn btn-outline">기능 살펴보기</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
