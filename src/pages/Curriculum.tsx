import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { chapters } from '../data/chapters';
import type { ReactElement } from 'react';

/* ─── Component ─── */

const Curriculum = (): ReactElement => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
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

  const toggleExpand = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
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

      {/* Section 1: 과정 개요 */}
      <section className="section">
        <div className="container">
          <div className="about-card about-main fade-in" ref={setFadeRef}>
            <div className="about-icon">📚</div>
            <h3>과정 개요</h3>
            <p>이 교육 과정은 NotebookLM을 처음 접하는 분부터 사업계획���와 IR Deck을 완성해야 하는 실무자까지, <strong>7단계에 걸쳐 체계적으로 학습</strong>할 수 있도록 설계되었습니다.</p>
            <div className="overview-chips">
              <span className="overview-chip">대상: 창업자, 연구자, 학생, 기업 실무자</span>
              <span className="overview-chip">선수지식: 없음 (Google 계정만 필요)</span>
              <span className="overview-chip">완성 산출물: 사업계획서 + IR Deck 10슬라이드</span>
              <span className="overview-chip">총 소요시간: 약 18시간</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 7개 챕터 상세 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">7 CHAPTERS</span>
            <h2 className="section-title">챕터별 상세 내용</h2>
            <p className="section-desc">각 챕터를 클릭하면 학습 목표와 활동을 확인할 수 있습니다</p>
          </div>
          <div className="curriculum-detail-list">
            {chapters.map((c, i) => (
              <div className={`curriculum-expand-card fade-in${expandedIdx === i ? ' expanded' : ''}${i === chapters.length - 1 ? ' curriculum-card-special' : ''}`} key={i} ref={setFadeRef}>
                <button className="curriculum-expand-header" onClick={() => toggleExpand(i)} aria-expanded={expandedIdx === i}>
                  <div className="curriculum-expand-left">
                    <span className="curriculum-chapter">{c.ch}</span>
                    <div>
                      <h3>{c.title}</h3>
                      <p>{c.desc}</p>
                    </div>
                  </div>
                  <div className="curriculum-expand-right">
                    <span className="curriculum-tag">{c.tag}</span>
                    <span className="curriculum-duration">{c.duration}</span>
                    <span className="faq-toggle">+</span>
                  </div>
                </button>
                <div className="curriculum-expand-body">
                  <div className="curriculum-expand-grid">
                    <div className="curriculum-expand-col">
                      <h4>학습 목표</h4>
                      <ul>
                        {c.learningGoals.slice(0, 3).map((g, j) => <li key={j}>{g}</li>)}
                      </ul>
                    </div>
                    <div className="curriculum-expand-col">
                      <h4>핵심 산출물</h4>
                      <ul>
                        {c.deliverables.map((d, j) => <li key={j}>{d}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="curriculum-detail-link">
                    <Link to={`/curriculum/ch${c.num}`} className="btn btn-primary btn-sm">전체 내용 보기 →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: 학습 흐름도 */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">FLOW</span>
            <h2 className="section-title">학습 흐름</h2>
            <p className="section-desc">CH.1부터 CH.7까지 단계별로 역량이 쌓입니다</p>
          </div>
          <div className="learning-flow fade-in" ref={setFadeRef}>
            {chapters.map((c, i) => (
              <Link to={`/curriculum/ch${c.num}`} className="flow-item" key={i}>
                <div className="flow-marker">{c.ch}</div>
                <div className="flow-label">{c.title}</div>
                {i < chapters.length - 1 && <div className="flow-arrow">→</div>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>교육을 신청하시겠습니까?</h2>
            <p>DreamIT Biz와 함께 체계적으로 배우고, 실무에 바로 적용하세요.</p>
            <div className="cta-actions">
              <Link to="/consulting" className="btn btn-primary btn-lg">교육 & 컨설팅</Link>
              <Link to="/techniques" className="btn btn-outline btn-lg">핵심 기법 보기</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Curriculum;
