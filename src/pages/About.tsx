import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import type { ReactElement } from 'react';

/* ─── Data ─── */

const aboutCards = [
  { icon: '🎯', title: '인용 추적 시스템', desc: '답변 문장 끝에 작은 번호가 표시되고, 클릭하면 원본 소스의 정확한 위치로 이동합니다. 사업계획서나 IR Deck처럼 출처가 곧 신뢰인 문서를 만들 때 결정적입니다.' },
  { icon: '📑', title: '세 칸 인터페이스', desc: '왼쪽에 자료를 넣으면(소스), 가운데에서 그 자료에 대해 대화하고(채팅), 오른쪽에서 다양한 형태로 가공합니다(Studio). 이 흐름은 출시 이후 거의 그대로입니다.' },
  { icon: '🔗', title: 'Google 생태계 연동', desc: '같은 Google 계정, 같은 Drive, 같은 Docs로 묶여 있어 Gemini와의 분업이 매끄럽습니다. 구글 시트 내보내기, PPTX 변환이 두 클릭으로 끝납니다.' },
];

const steps = [
  {
    num: 1,
    title: '노트북 생성 & 소스 업로드',
    details: [
      { label: '지원 소스 형식', items: ['PDF, Word, PowerPoint, 텍스트', 'Google Docs, Google Slides', '웹사이트 URL, YouTube 영상', '직접 텍스트 입력'] },
    ],
  },
  {
    num: 2,
    title: '채팅으로 질문하기',
    desc: '가운데 채팅 영역에서 자료에 대해 자유롭게 질문합니다. 모든 답변에 인용 번호가 붙습니다.',
    example: { badge: '좋은 질문 예시', text: '"이 5개 회사의 가격 정책을 회사 · 요금제 · 월 가격 · 차별 조항으로 표를 만들어줘. 출처는 회사명 옆에 인용 번호로 표시해줘."' },
  },
  {
    num: 3,
    title: 'Studio로 가공하기',
    desc: '오른쪽 Studio 패널에서 같은 자료를 다양한 형태로 가공합니다.',
    details: [
      { label: 'Studio 결과물', items: ['Audio Overview (한국어/영어 팟캐스트)', '슬라이드 자료 & 동영상 개요', '마인드맵 & 인포그래픽', '보고서 & 데이터 표', '퀴즈 & 플래시카드'] },
    ],
  },
];

const targetAudience = [
  { icon: '🚀', label: '창업자 · 예비창업자', desc: '사업계획서, IR Deck, 시장 분석 보고서를 출처 기반으로 작성하고 싶은 분' },
  { icon: '🔬', label: '연구자 · 대학원생', desc: '논문 리뷰, 문헌 정리, 연구 노트를 체계적으로 관리하고 싶은 분' },
  { icon: '🎓', label: '학생 · 취업 준비생', desc: '강의 자료 정리, 시험 준비, 포트폴리오 구성에 AI를 활용하고 싶은 분' },
  { icon: '🏢', label: '기업 팀 · 실무자', desc: '회의록, 보고서, 경쟁사 분석 등 업무 문서를 빠르게 가공하고 싶은 분' },
];

/* ─── Component ─── */

const About = (): ReactElement => {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);

  const setFadeRef = useCallback((el: HTMLElement | null) => {
    if (el && !fadeRefs.current.includes(el)) {
      fadeRefs.current.push(el);
    }
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

  return (
    <>
      <SEOHead title="NotebookLM이란?" description="Google Gemini 기반 AI 리서치 도구 NotebookLM의 핵심 개념과 사용법을 알아보세요." path="/about" />

      {/* page-header */}
      <section className="page-header">
        <div className="container">
          <span className="page-badge">ABOUT</span>
          <h1 className="page-title">NotebookLM이란?</h1>
          <p className="page-description">Google Gemini 기반의 AI 리서치 도구 — 내 자료만 학습하는 나만의 AI 비서</p>
        </div>
      </section>

      {/* Section 1: 핵심 개념 */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-card about-main fade-in" ref={setFadeRef}>
              <div className="about-icon">🤖</div>
              <h3>내 자료만 근거로 답하는 AI</h3>
              <p>NotebookLM은 구글이 Gemini 모델을 기반으로 만든 AI 리서치 도구입니다. 일반 챗봇과 달리 <strong>사용자가 업로드한 문서만을 바탕으로 답변을 생성</strong>합니다. 모든 답변에 인용 번호가 붙어 출처를 바로 확인할 수 있으며, 이것이 다른 AI 도구와의 결정적 차이입니다.</p>
              <p style={{ marginTop: '16px' }}>ChatGPT, Claude, Gemini 같은 범용 챗봇은 학습 데이터에 들어 있는 일반 지식으로 답합니다. NotebookLM은 <strong>사용자가 올린 자료만 근거로 답하며</strong>, 모든 답변에 인용 번호가 붙어 출처를 바로 확인할 수 있습니다. 사업계획서처럼 출처가 곧 신뢰인 문서를 만들 때 결정적인 차이입니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 3가지 차별점 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">DIFFERENTIATORS</span>
            <h2 className="section-title">NotebookLM의 3가지 차별점</h2>
            <p className="section-desc">다른 AI 도구와 무엇이 다른가요?</p>
          </div>
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
      </section>

      {/* Section 3: 사용법 3단계 */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">HOW TO USE</span>
            <h2 className="section-title">NotebookLM 사용법</h2>
            <p className="section-desc">소스 → 채팅 → Studio, 세 칸의 흐름을 기억하세요</p>
          </div>
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
                    <ul>
                      {steps[0].details![0].items.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="step-tip">
                    <span className="tip-badge">핵심 원칙</span>
                    <p>노트북은 "주제" 단위가 아니라 <strong>"프로젝트" 단위</strong>로 만듭니다. "마케팅 공부" 하나에 모든 걸 몰아넣으면 자료끼리 섞여 챗봇이 헷갈립니다.</p>
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
                    <p>{steps[1].example!.text}</p>
                  </div>
                  <div className="step-tip">
                    <span className="tip-badge">TIP</span>
                    <p>답변을 핀 아이콘으로 저장하면 Studio 패널에 메모로 추가됩니다. 이 메모는 다시 <strong>소스로 변환</strong>해서 노트북이 점점 똑똑해지는 구조를 만들 수 있습니다.</p>
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
                    <ul>
                      {steps[2].details![0].items.map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 대상 안내 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">FOR YOU</span>
            <h2 className="section-title">이런 분께 추천합니다</h2>
            <p className="section-desc">NotebookLM은 자료 기반 작업이 많은 모든 분에게 유용합니다</p>
          </div>
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
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>체계적으로 배워보세요</h2>
            <p>DreamIT Biz의 7개 챕터 커리큘럼으로 NotebookLM을 마스터하세요.</p>
            <div className="cta-actions">
              <Link to="/curriculum" className="btn btn-primary btn-lg">커리큘럼 보기</Link>
              <Link to="/features" className="btn btn-outline btn-lg">기능 살펴보기</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
