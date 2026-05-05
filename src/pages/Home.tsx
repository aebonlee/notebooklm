import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import site from '../config/site';
import { chapters } from '../data/chapters';
import type { ReactElement } from 'react';

/* ─── useCountUp Hook ─── */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

/* ─── Data ─── */
const courseBenefitCards = [
  { icon: '📋', title: '실전 프로젝트 기반', desc: '단순 기능 설명이 아닌 사업계획서 완성까지 — 교육 종료 시 IR Deck 10슬라이드 산출물 확보', path: '/curriculum' },
  { icon: '✅', title: '출처 기반 신뢰 문서', desc: '모든 문장에 인용 번호, 자료 신뢰도 등급제(A/B/C)로 검증된 결과물 작성법 학습', path: '/techniques' },
  { icon: '⚡', title: '즉시 업무 적용', desc: '교육 당일 실무 문서에 바로 적용 가능한 6가지 핵심 기법과 프롬프트 템플릿 제공', path: '/consulting' },
];

const featuresMini = [
  { icon: '🎙️', title: 'Audio Overview', desc: 'AI 팟캐스트' },
  { icon: '🗺️', title: '마인드맵', desc: '구조 시각화' },
  { icon: '📊', title: '슬라이드', desc: '발표 자료' },
  { icon: '🎬', title: '동영상', desc: '영상 변환' },
  { icon: '🔍', title: '딥리서치', desc: '웹 자동 수집' },
  { icon: '📝', title: '퀴즈', desc: '학습 문제' },
];

const techniqueHighlights = [
  { icon: '🔬', title: '딥리서치 질문 설계', before: '"온라인 교육 시장은 어때?"', after: '"한국 비전공자 코딩 교육 VOD 시장 2024~2025 규모와 주요 5곳 조사해줘"' },
  { icon: '🏷️', title: '자료 신뢰도 등급제', before: '모든 소스를 동등하게 인용', after: 'A(공인기관) / B(언론) / C(블로그)로 분류 후 활용' },
  { icon: '👤', title: '출처 있는 페르소나', before: '"박지훈, 29세, 마케터"', after: '"박지훈, 29세 (출처: 사람인 2025 직무전환 설문 p.8)"' },
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

  const stat1 = useCountUp(7);
  const stat2 = useCountUp(6);
  const stat3 = useCountUp(50);
  const stat4 = useCountUp(4);

  return (
    <>
      <SEOHead title={`${site.name} | ${site.nameKo}`} description={site.description} />

      {/* 1. Hero */}
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
              자료 수집, 시장 분석, IR Deck 완성까지 한 흐름으로 배웁니다.
            </p>
            <div className="hero-actions">
              <Link to="/curriculum" className="btn btn-primary">커리큘럼 보기</Link>
              <Link to="/consulting" className="btn btn-outline">교육 문의하기</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><span className="stat-number">7</span><span className="stat-label">챕터 커리큘럼</span></div>
              <div className="stat"><span className="stat-number">6</span><span className="stat-label">핵심 기법</span></div>
              <div className="stat"><span className="stat-number">50+</span><span className="stat-label">소스 활용</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 이 교육의 특장점 */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">WHY THIS COURSE</span>
            <h2 className="section-title">이 교육이 다른 이유</h2>
            <p className="section-desc">기능 나열이 아닌, 실무 산출물 완성에 초점을 맞춘 과정</p>
          </div>
          <div className="home-about-grid">
            {courseBenefitCards.map((card, i) => (
              <Link to={card.path} className="home-about-card fade-in" key={i} ref={setFadeRef}>
                <div className="home-about-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features 그리드 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">STUDIO</span>
            <h2 className="section-title">Studio 기능</h2>
            <p className="section-desc">같은 자료를 6가지 형태로 변환</p>
          </div>
          <div className="home-features-mini-grid">
            {featuresMini.map((f, i) => (
              <Link to="/features" className="home-feature-mini fade-in" key={i} ref={setFadeRef}>
                <span className="feature-mini-icon">{f.icon}</span>
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/features" className="btn btn-outline">전체 기능 보기</Link>
          </div>
        </div>
      </section>

      {/* 4. 커리큘럼 오버뷰 */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CURRICULUM</span>
            <h2 className="section-title">7개 챕터 교육 과정</h2>
            <p className="section-desc">기초부터 사업계획서 완성까지 단계별 학습</p>
          </div>
          <div className="home-curriculum-grid">
            {chapters.map((ch, i) => (
              <Link to={`/curriculum/ch${ch.num}`} className="home-curriculum-card fade-in" key={i} ref={setFadeRef}>
                <span className="home-ch-badge">{ch.ch}</span>
                <h3>{ch.title}</h3>
                <span className="home-ch-tag">{ch.tag}</span>
                <p>{ch.desc.length > 60 ? ch.desc.slice(0, 60) + '...' : ch.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 핵심기법 하이라이트 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">TECHNIQUES</span>
            <h2 className="section-title">핵심 기법 미리보기</h2>
            <p className="section-desc">Before → After로 보는 기법의 차이</p>
          </div>
          <div className="home-techniques-grid">
            {techniqueHighlights.map((t, i) => (
              <div className="home-technique-card fade-in" key={i} ref={setFadeRef}>
                <div className="technique-card-header">
                  <span className="technique-card-icon">{t.icon}</span>
                  <h3>{t.title}</h3>
                </div>
                <div className="technique-before-after">
                  <div className="technique-before"><span>Before</span><p>{t.before}</p></div>
                  <div className="technique-after"><span>After</span><p>{t.after}</p></div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/techniques" className="btn btn-outline">전체 기법 보기</Link>
          </div>
        </div>
      </section>

      {/* 6. 숫자로 보는 과정 */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">NUMBERS</span>
            <h2 className="section-title">숫자로 보는 과정</h2>
          </div>
          <div className="home-stats-grid">
            <div className="home-stat-card" ref={stat1.ref}>
              <span className="home-stat-number">{stat1.count}</span>
              <span className="home-stat-label">챕터 커리큘럼</span>
            </div>
            <div className="home-stat-card" ref={stat2.ref}>
              <span className="home-stat-number">{stat2.count}</span>
              <span className="home-stat-label">핵심 기법</span>
            </div>
            <div className="home-stat-card" ref={stat3.ref}>
              <span className="home-stat-number">{stat3.count}+</span>
              <span className="home-stat-label">활용 소스</span>
            </div>
            <div className="home-stat-card" ref={stat4.ref}>
              <span className="home-stat-number">{stat4.count}</span>
              <span className="home-stat-label">교육 프로그램</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 교육신청 CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>NotebookLM으로 업무를 혁신하세요</h2>
            <p>4시간 단기 강의부터 16시간 집중 워크숍까지, 기업 상황에 맞춰 선택하세요.</p>
            <div className="cta-actions">
              <Link to="/consulting" className="btn btn-primary btn-lg">교육 프로그램 보기</Link>
              <a href="https://notebooklm.google/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">NotebookLM 시작하기</a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 자료 & 커뮤니티 */}
      <section className="section section-alt">
        <div className="container">
          <div className="home-links-grid">
            <Link to="/resources" className="home-link-card fade-in" ref={setFadeRef}>
              <span className="home-link-icon">📁</span>
              <h3>자료실</h3>
              <p>교육 자료, 템플릿, 영상을 다운로드하세요</p>
              <span className="preview-link">바로가기 →</span>
            </Link>
            <Link to="/community/board" className="home-link-card fade-in" ref={setFadeRef}>
              <span className="home-link-icon">💬</span>
              <h3>커뮤니티</h3>
              <p>질문, 팁 공유, 활용 사례를 나눠보세요</p>
              <span className="preview-link">바로가기 →</span>
            </Link>
            <Link to="/use-cases" className="home-link-card fade-in" ref={setFadeRef}>
              <span className="home-link-icon">💡</span>
              <h3>활용사례</h3>
              <p>비즈니스, 연구, 교육 현장 실전 사례</p>
              <span className="preview-link">바로가기 →</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
