import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import { chapters } from '../../data/chapters';
import type { ChapterData } from '../../data/chapters';
import type { ReactElement } from 'react';

interface ChapterPageProps {
  chapterIndex: number;
}

const ChapterPage = ({ chapterIndex }: ChapterPageProps): ReactElement => {
  const chapter: ChapterData = chapters[chapterIndex];
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

  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  return (
    <>
      <SEOHead title={`${chapter.ch} ${chapter.title}`} description={chapter.desc} path={`/curriculum/ch${chapter.num}`} />

      {/* page-header */}
      <section className="page-header">
        <div className="container">
          <span className="page-badge">{chapter.ch}</span>
          <h1 className="page-title">{chapter.title}</h1>
          <p className="page-description">{chapter.desc}</p>
        </div>
      </section>

      {/* 개요 카드 */}
      <section className="section">
        <div className="container">
          <div className="chapter-overview-grid fade-in" ref={setFadeRef}>
            <div className="chapter-meta-card">
              <span className="chapter-meta-label">단계</span>
              <span className="chapter-meta-value">{chapter.tag}</span>
            </div>
            <div className="chapter-meta-card">
              <span className="chapter-meta-label">예상 소요시간</span>
              <span className="chapter-meta-value">{chapter.duration}</span>
            </div>
            <div className="chapter-meta-card">
              <span className="chapter-meta-label">산출물</span>
              <span className="chapter-meta-value">{chapter.deliverables.length}개</span>
            </div>
            <div className="chapter-meta-card">
              <span className="chapter-meta-label">활용 도구</span>
              <span className="chapter-meta-value">{chapter.tools.length}개</span>
            </div>
          </div>
        </div>
      </section>

      {/* 학습 목표 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">GOALS</span>
            <h2 className="section-title">학습 목표</h2>
          </div>
          <div className="chapter-goals-list fade-in" ref={setFadeRef}>
            {chapter.learningGoals.map((goal, i) => (
              <div className="chapter-goal-item" key={i}>
                <span className="goal-number">{i + 1}</span>
                <p>{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 핵심 활동 */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">ACTIVITIES</span>
            <h2 className="section-title">핵심 활동</h2>
          </div>
          <div className="steps-timeline">
            {chapter.keyActivities.map((activity, i) => (
              <div className="step fade-in" key={i} ref={setFadeRef}>
                <div className="step-marker"><span>{i + 1}</span></div>
                <div className="step-content">
                  <h3>{activity}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 주요 토픽 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">TOPICS</span>
            <h2 className="section-title">주요 토픽</h2>
          </div>
          <div className="chapter-topics-grid fade-in" ref={setFadeRef}>
            {chapter.topics.map((topic, i) => (
              <div className="chapter-topic-card" key={i}>
                <span className="topic-bullet"></span>
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 산출물 & 도구 */}
      <section className="section">
        <div className="container">
          <div className="chapter-output-grid">
            <div className="chapter-output-section fade-in" ref={setFadeRef}>
              <h3>산출물</h3>
              <ul>
                {chapter.deliverables.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
            <div className="chapter-output-section fade-in" ref={setFadeRef}>
              <h3>활용 도구</h3>
              <div className="curriculum-tools">
                {chapter.tools.map((t, i) => <span key={i}>{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 챕터 네비게이션 */}
      <section className="section section-alt">
        <div className="container">
          <div className="chapter-nav">
            {prevChapter ? (
              <Link to={`/curriculum/ch${prevChapter.num}`} className="chapter-nav-btn chapter-nav-prev">
                <span className="chapter-nav-label">이전 챕터</span>
                <span className="chapter-nav-title">{prevChapter.ch} {prevChapter.title}</span>
              </Link>
            ) : (
              <Link to="/curriculum" className="chapter-nav-btn chapter-nav-prev">
                <span className="chapter-nav-label">돌아가기</span>
                <span className="chapter-nav-title">커리큘럼 개요</span>
              </Link>
            )}
            {nextChapter ? (
              <Link to={`/curriculum/ch${nextChapter.num}`} className="chapter-nav-btn chapter-nav-next">
                <span className="chapter-nav-label">다음 챕터</span>
                <span className="chapter-nav-title">{nextChapter.ch} {nextChapter.title}</span>
              </Link>
            ) : (
              <Link to="/consulting" className="chapter-nav-btn chapter-nav-next">
                <span className="chapter-nav-label">교육 신청</span>
                <span className="chapter-nav-title">교육 & 컨설팅</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ChapterPage;
