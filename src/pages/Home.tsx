import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import site from '../config/site';
import type { ReactElement } from 'react';

/* ─── Data ─── */

const previewCards = [
  { icon: '🤖', title: 'NotebookLM이란?', desc: '내 자료만 근거로 답하는 AI — 핵심 개념, 3가지 차별점, 사용법 3단계를 알아보세요.', path: '/about', badge: 'ABOUT' },
  { icon: '🎨', title: 'Studio 패널 기능', desc: 'Audio Overview, 마인드맵, 슬라이드, 동영상, 딥리서치, 퀴즈 등 6가지 핵심 기능.', path: '/features', badge: 'FEATURES' },
  { icon: '📚', title: '7개 챕터 커리큘럼', desc: '기초부터 사업계획서, IR Deck 완성까지 — DreamIT Biz가 설계한 체계적 교육 과정.', path: '/curriculum', badge: 'CURRICULUM' },
  { icon: '🛠️', title: '교육 핵심 기법', desc: '딥리서치 질문 설계, 신뢰도 등급제, 페르소나 검증 등 6가지 실전 기법.', path: '/techniques', badge: 'TECHNIQUES' },
  { icon: '🏢', title: '교육 & 컨설팅', desc: '4h 단기부터 16h 워크숍까지 — 기업 맞춤 교육과 컨설팅 프로그램.', path: '/consulting', badge: 'TRAINING' },
];

/* ─── Component ─── */

const Home = (): ReactElement => {
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
      <SEOHead title={`${site.name} | ${site.nameKo}`} description={site.description} />

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">DreamIT Biz × Google NotebookLM</span>
            <h1 className="hero-title">
              <span className="gradient-text">NotebookLM</span> 실전 과정<br />
              기초부터 사업계획서까지
            </h1>
            <p className="hero-desc">
              드림아이티비즈가 설계한 NotebookLM 교육 과정.<br />
              자료 수집, 시장 분석, IR Deck 완성까지 한 흐름으로 배웁니다.<br />
              기업 맞춤 컨설팅과 워크숍도 제공합니다.
            </p>
            <div className="hero-actions">
              <Link to="/curriculum" className="btn btn-primary">커리큘럼 보기</Link>
              <Link to="/consulting" className="btn btn-outline">교육 문의하기</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><span className="stat-number">7</span><span className="stat-label">챕터 커리큘럼</span></div>
              <div className="stat"><span className="stat-number">실전</span><span className="stat-label">사업계획서 완성</span></div>
              <div className="stat"><span className="stat-number">맞춤</span><span className="stat-label">기업 컨설팅</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Cards */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">EXPLORE</span>
            <h2 className="section-title">학습 콘텐츠</h2>
            <p className="section-desc">각 주제를 클릭하여 상세 내용을 확인하세요</p>
          </div>
          <div className="home-preview-grid">
            {previewCards.map((card, i) => (
              <Link to={card.path} className="home-preview-card fade-in" key={i} ref={setFadeRef}>
                <span className="preview-badge">{card.badge}</span>
                <div className="preview-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <span className="preview-link">자세히 보기 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>NotebookLM으로 업무를 혁신하세요</h2>
            <p>DreamIT Biz와 함께 체계적으로 배우고, 실무에 바로 적용하세요.</p>
            <div className="cta-actions">
              <a href="https://dreamitbiz.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">DreamIT Biz 방문</a>
              <a href="https://notebooklm.google/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">NotebookLM 시작하기</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
