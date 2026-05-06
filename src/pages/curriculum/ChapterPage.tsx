import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import { chapters } from '../../data/chapters';
import type { ChapterData } from '../../data/chapters';
import type { ReactElement } from 'react';

interface ChapterPageProps {
  chapterIndex: number;
}

const navSections = [
  { id: 'overview', label: '개요' },
  { id: 'goals', label: '학습 목표' },
  { id: 'topics', label: '주요 토픽' },
  { id: 'activities', label: '핵심 활동' },
  { id: 'prompts', label: '실전 프롬프트' },
  { id: 'tips', label: 'Pro Tips' },
  { id: 'output', label: '산출물 & 도구' },
];

const ChapterPage = ({ chapterIndex }: ChapterPageProps): ReactElement => {
  const chapter: ChapterData = chapters[chapterIndex];
  const [activeSection, setActiveSection] = useState('overview');
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

  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  return (
    <>
      <SEOHead title={`${chapter.ch} ${chapter.title}`} description={chapter.desc} path={`/curriculum/ch${chapter.num}`} />

      {/* page-header */}
      <section className="page-header">
        <div className="container">
          <span className="page-badge">{chapter.ch} — {chapter.tag}</span>
          <h1 className="page-title">{chapter.title}</h1>
          <p className="page-description">{chapter.desc}</p>
          <div className="chapter-header-meta">
            <span className="chapter-meta-pill">⏱ {chapter.duration}</span>
            <span className="chapter-meta-pill">📦 산출물 {chapter.deliverables.length}개</span>
            <span className="chapter-meta-pill">🛠 도구 {chapter.tools.length}개</span>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
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
              {/* 개요 */}
              <div id="overview" ref={setSectionRef('overview')} className="content-section">
                <span className="content-section-badge">OVERVIEW</span>
                <h2 className="content-section-title">개요</h2>
                <p className="chapter-overview-text">{chapter.overview}</p>

                {chapter.prerequisites.length > 0 && (
                  <div className="chapter-prerequisites fade-in" ref={setFadeRef}>
                    <h4>사전 준비 사항</h4>
                    <ul>
                      {chapter.prerequisites.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="chapter-outcome fade-in" ref={setFadeRef}>
                  <h4>기대 결과</h4>
                  <p>{chapter.expectedOutcome}</p>
                </div>
              </div>

              {/* 학습 목표 */}
              <div id="goals" ref={setSectionRef('goals')} className="content-section">
                <span className="content-section-badge">GOALS</span>
                <h2 className="content-section-title">학습 목표</h2>
                <p className="content-section-desc">이 챕터를 마치면 다음을 할 수 있습니다</p>
                <div className="chapter-goals-list">
                  {chapter.learningGoals.map((goal, i) => (
                    <div className="chapter-goal-item fade-in" key={i} ref={setFadeRef}>
                      <span className="goal-number">{i + 1}</span>
                      <p>{goal}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 주요 토픽 */}
              <div id="topics" ref={setSectionRef('topics')} className="content-section">
                <span className="content-section-badge">TOPICS</span>
                <h2 className="content-section-title">주요 토픽</h2>
                <p className="content-section-desc">이 챕터에서 다루는 핵심 개념과 기법</p>
                <div className="chapter-topics-detailed">
                  {chapter.topics.map((topic, i) => (
                    <div className="chapter-topic-detail fade-in" key={i} ref={setFadeRef}>
                      <div className="topic-detail-header">
                        <span className="topic-detail-num">{i + 1}</span>
                        <h3>{topic.title}</h3>
                      </div>
                      <p>{topic.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 핵심 활동 */}
              <div id="activities" ref={setSectionRef('activities')} className="content-section">
                <span className="content-section-badge">ACTIVITIES</span>
                <h2 className="content-section-title">핵심 활동</h2>
                <p className="content-section-desc">실습 중심의 단계별 활동</p>
                <div className="chapter-activities-detailed">
                  {chapter.keyActivities.map((activity, i) => (
                    <div className="chapter-activity-card fade-in" key={i} ref={setFadeRef}>
                      <div className="activity-card-header">
                        <span className="activity-step-num">Step {i + 1}</span>
                        <h3>{activity.title}</h3>
                      </div>
                      <p className="activity-card-desc">{activity.description}</p>
                      {activity.tip && (
                        <div className="activity-tip">
                          <span className="tip-icon">💡</span>
                          <span>{activity.tip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 실전 프롬프트 */}
              <div id="prompts" ref={setSectionRef('prompts')} className="content-section">
                <span className="content-section-badge">PROMPTS</span>
                <h2 className="content-section-title">실전 프롬프트 예시</h2>
                <p className="content-section-desc">NotebookLM에 바로 복사하여 사용할 수 있는 프롬프트</p>
                <div className="chapter-prompts-list">
                  {chapter.examplePrompts.map((ep, i) => (
                    <div className="chapter-prompt-card fade-in" key={i} ref={setFadeRef}>
                      <div className="prompt-context">
                        <span className="prompt-context-label">상황</span>
                        <span>{ep.context}</span>
                      </div>
                      <div className="prompt-text">
                        <span className="prompt-text-label">프롬프트</span>
                        <p>{ep.prompt}</p>
                      </div>
                      <div className="prompt-result">
                        <span className="prompt-result-label">예상 결과</span>
                        <span>{ep.expectedResult}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              <div id="tips" ref={setSectionRef('tips')} className="content-section">
                <span className="content-section-badge">PRO TIPS</span>
                <h2 className="content-section-title">Pro Tips</h2>
                <p className="content-section-desc">강사가 알려주는 실전 노하우</p>
                <div className="chapter-tips-grid">
                  {chapter.proTips.map((tip, i) => (
                    <div className="chapter-tip-card fade-in" key={i} ref={setFadeRef}>
                      <span className="tip-number">#{i + 1}</span>
                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 산출물 & 도구 */}
              <div id="output" ref={setSectionRef('output')} className="content-section">
                <span className="content-section-badge">OUTPUT</span>
                <h2 className="content-section-title">산출물 & 활용 도구</h2>
                <div className="chapter-output-grid">
                  <div className="chapter-output-section fade-in" ref={setFadeRef}>
                    <h3>📦 산출물</h3>
                    <p className="output-section-desc">이 챕터에서 완성하는 결과물</p>
                    <ul>
                      {chapter.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                  <div className="chapter-output-section fade-in" ref={setFadeRef}>
                    <h3>🛠 활용 도구</h3>
                    <p className="output-section-desc">실습에 필요한 도구</p>
                    <div className="curriculum-tools">
                      {chapter.tools.map((t, i) => <span key={i}>{t}</span>)}
                    </div>
                  </div>
                </div>
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
