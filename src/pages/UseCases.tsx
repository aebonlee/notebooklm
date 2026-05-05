import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import type { ReactElement } from 'react';

const useCaseCategories = [
  {
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

const UseCases = (): ReactElement => {
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
      <SEOHead title="활용사례" description="NotebookLM 실전 활용 사례. 비즈니스, 연구, 교육 현장에서의 활용법." path="/use-cases" />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">USE CASES</span>
          <h1 className="page-title">활용사례</h1>
          <p className="page-description">NotebookLM을 실무에 적용하는 다양한 방법</p>
        </div>
      </section>

      {/* 분야별 활용 */}
      {useCaseCategories.map((cat, i) => (
        <section className={`section${i % 2 === 1 ? ' section-alt' : ''}`} key={i}>
          <div className="container">
            <div className="section-header">
              <span className="section-badge">{cat.badge}</span>
              <h2 className="section-title">{cat.title}</h2>
            </div>
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
        </section>
      ))}

      {/* 실전 시나리오 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">REAL STORIES</span>
            <h2 className="section-title">실전 시나리오</h2>
            <p className="section-desc">NotebookLM을 활용한 실제 성과 사례</p>
          </div>
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
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>이 활용법을 직접 배워보세요</h2>
            <p>DreamIT Biz의 교육 과정에서 실전 실습과 피드백을 받을 수 있습니다.</p>
            <div className="cta-actions">
              <Link to="/consulting" className="btn btn-primary btn-lg">교육 문의하기</Link>
              <Link to="/curriculum" className="btn btn-outline btn-lg">커리큘럼 보기</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UseCases;
