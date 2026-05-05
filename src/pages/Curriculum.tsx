import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { chapters } from '../data/chapters';
import type { ReactElement } from 'react';

/* ─── Component ─── */

const Curriculum = (): ReactElement => {
  const [activeSection, setActiveSection] = useState('overview');
  const location = useLocation();
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

  /* Intersection-based active section tracking */
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

  /* Hash scroll */
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <SEOHead title="7개 챕터 교육 과정" description="DreamIT Biz가 설계한 체계적 NotebookLM 실전 커리큘럼. 기초부터 사업계획서까지 7단계로 배우세요." path="/curriculum" />

      {/* page-header */}
      <section className="page-header">
        <div className="container">
          <span className="page-badge">CURRICULUM</span>
          <h1 className="page-title">7개 챕터 교육 과정</h1>
          <p className="page-description">DreamIT Biz가 설계한 체계적 NotebookLM 실전 커리큘럼</p>
        </div>
      </section>

      {/* Sidebar Layout */}
      <section className="section">
        <div className="container">
          <div className="curriculum-sidebar-layout">
            {/* Left Sidebar */}
            <aside className="curriculum-sidebar">
              <nav className="curriculum-nav">
                <button className={`curriculum-nav-item${activeSection === 'overview' ? ' active' : ''}`} onClick={() => scrollTo('overview')}>
                  <span className="nav-dot"></span>
                  과정 개요
                </button>
                {chapters.map((c) => (
                  <button key={c.num} className={`curriculum-nav-item${activeSection === `ch${c.num}` ? ' active' : ''}`} onClick={() => scrollTo(`ch${c.num}`)}>
                    <span className="nav-dot"></span>
                    <span className="nav-ch">{c.ch}</span> {c.title}
                  </button>
                ))}
                <button className={`curriculum-nav-item${activeSection === 'flow' ? ' active' : ''}`} onClick={() => scrollTo('flow')}>
                  <span className="nav-dot"></span>
                  학습 흐름
                </button>
              </nav>
            </aside>

            {/* Right Content */}
            <div className="curriculum-main">
              {/* Overview */}
              <div id="overview" ref={setSectionRef('overview')} className="curriculum-section fade-in" ref-fade={setFadeRef}>
                <h2 className="curriculum-section-title">과정 개요</h2>
                <p className="curriculum-section-desc">
                  이 교육 과정은 NotebookLM을 처음 접하는 분부터 사업계획서와 IR Deck을 완성해야 하는 실무자까지,
                  <strong> 7단계에 걸쳐 체계적으로 학습</strong>할 수 있도록 설계되었습니다.
                </p>
                <div className="curriculum-overview-grid">
                  <div className="curriculum-overview-card">
                    <strong>대상</strong>
                    <p>창업자, 연구자, 학생, 기업 실무자</p>
                  </div>
                  <div className="curriculum-overview-card">
                    <strong>선수지식</strong>
                    <p>없음 (Google 계정만 필요)</p>
                  </div>
                  <div className="curriculum-overview-card">
                    <strong>완성 산출물</strong>
                    <p>사업계획서 + IR Deck 10슬라이드</p>
                  </div>
                  <div className="curriculum-overview-card">
                    <strong>총 소요시간</strong>
                    <p>약 18시간 (7챕터)</p>
                  </div>
                </div>
              </div>

              {/* Chapters */}
              {chapters.map((c) => (
                <div id={`ch${c.num}`} key={c.num} ref={setSectionRef(`ch${c.num}`)} className="curriculum-section fade-in" ref-fade={setFadeRef}>
                  <div className="curriculum-section-header">
                    <span className="curriculum-ch-badge">{c.ch}</span>
                    <span className="curriculum-ch-tag">{c.tag}</span>
                    <span className="curriculum-ch-duration">{c.duration}</span>
                  </div>
                  <h2 className="curriculum-section-title">{c.title}</h2>
                  <p className="curriculum-section-desc">{c.desc}</p>

                  {/* 학습 목표 */}
                  <div className="curriculum-block">
                    <h4 className="curriculum-block-title">학습 목표</h4>
                    <ul className="curriculum-goal-list">
                      {c.learningGoals.map((g, j) => <li key={j}>{g}</li>)}
                    </ul>
                  </div>

                  {/* 주요 학습 내용 */}
                  <div className="curriculum-block">
                    <h4 className="curriculum-block-title">주요 학습 내용</h4>
                    <div className="curriculum-topic-chips">
                      {c.topics.map((t, j) => <span key={j} className="curriculum-topic-chip">{t}</span>)}
                    </div>
                  </div>

                  {/* 핵심 활동 & 산출물 */}
                  <div className="curriculum-two-col">
                    <div className="curriculum-block">
                      <h4 className="curriculum-block-title">핵심 활동</h4>
                      <ul className="curriculum-activity-list">
                        {c.keyActivities.map((a, j) => <li key={j}>{a}</li>)}
                      </ul>
                    </div>
                    <div className="curriculum-block">
                      <h4 className="curriculum-block-title">산출물 & 도구</h4>
                      <ul className="curriculum-deliverable-list">
                        {c.deliverables.map((d, j) => <li key={j}>{d}</li>)}
                      </ul>
                      <div className="curriculum-tool-chips">
                        {c.tools.map((t, j) => <span key={j} className="curriculum-tool-chip">{t}</span>)}
                      </div>
                    </div>
                  </div>

                  <div className="curriculum-chapter-link">
                    <Link to={`/curriculum/ch${c.num}`} className="btn btn-outline btn-sm">챕터 상세 페이지 →</Link>
                  </div>
                </div>
              ))}

              {/* Flow */}
              <div id="flow" ref={setSectionRef('flow')} className="curriculum-section fade-in" ref-fade={setFadeRef}>
                <h2 className="curriculum-section-title">학습 흐름</h2>
                <p className="curriculum-section-desc">CH.1부터 CH.7까지 단계별로 역량이 쌓입니다</p>
                <div className="learning-flow">
                  {chapters.map((c, i) => (
                    <Link to={`/curriculum/ch${c.num}`} className="flow-item" key={i}>
                      <div className="flow-marker">{c.ch}</div>
                      <div className="flow-label">{c.title}</div>
                      {i < chapters.length - 1 && <div className="flow-arrow">→</div>}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="curriculum-section curriculum-cta">
                <h3>교육을 신청하시겠습니까?</h3>
                <p>DreamIT Biz와 함께 체계적으로 배우고, 실무에 바로 적용하세요.</p>
                <div className="curriculum-cta-actions">
                  <Link to="/consulting" className="btn btn-primary">교육 & 컨설팅</Link>
                  <Link to="/techniques" className="btn btn-outline">핵심 기법 보기</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Curriculum;
