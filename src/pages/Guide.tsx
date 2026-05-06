import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import type { ReactElement } from 'react';

const setupSteps = [
  { num: 1, title: 'Google 계정 준비', desc: 'Gmail이 있으면 바로 시작할 수 있습니다. 업무용 Google Workspace 계정도 사용 가능합니다.' },
  { num: 2, title: 'NotebookLM 접속', desc: 'notebooklm.google 에 접속하여 Google 계정으로 로그인합니다.' },
  { num: 3, title: '새 노트북 만들기', desc: '"새 노트북" 버튼을 클릭하고, 첫 번째 소스를 업로드합니다.' },
  { num: 4, title: '소스 업로드', desc: 'PDF, Docs, URL, YouTube 등 다양한 형식의 자료를 소스로 추가합니다.' },
];

const beginnerTips = [
  { icon: '1', title: '프로젝트 단위로 노트북 분리', desc: '"마케팅" 하나에 모든 자료를 넣지 말고, "A사 경쟁분석", "B제품 기획" 등 프로젝트별로 나누세요.' },
  { icon: '2', title: '질문은 구체적으로', desc: '"이 시장은 어때?"보다 "2024~2025년 한국 코딩 교육 시장 규모와 주요 5개 업체를 표로 정리해줘"가 좋습니다.' },
  { icon: '3', title: '인용 번호 항상 확인', desc: '답변의 인용 번호를 클릭하면 원본 소스의 해당 부분으로 이동합니다. 숫자와 연도는 반드시 원문에서 확인하세요.' },
  { icon: '4', title: '메모를 소스로 변환', desc: '채팅 답변을 핀 고정하면 메모가 됩니다. 이 메모를 소스로 변환하면 노트북이 점점 더 똑똑해집니다.' },
  { icon: '5', title: 'Studio 적극 활용', desc: '같은 자료를 팟캐스트, 마인드맵, 슬라이드, 퀴즈 등 다양한 형태로 변환하여 활용하세요.' },
];

const commonMistakes = [
  { bad: '한 노트북에 모든 주제를 몰아넣기', good: '프로젝트/주제별로 노트북 분리하기' },
  { bad: '"마케팅 공부 노트북" (너무 넓음)', good: '"점심 정기구독 사업 - 시장 조사" (프로젝트 단위)' },
  { bad: '막연한 질문 ("이거 어때?")', good: '범위, 형식, 개수를 명시한 구체적 질문' },
  { bad: '인용 번호 확인 없이 답변 그대로 사용', good: '숫자/연도/단위는 반드시 원문 대조' },
  { bad: '소스 50개를 전부 체크한 채 질문', good: '관련 소스 5~10개만 선택하여 집중 질문' },
  { bad: '모으기만 하고 묻지 않는다', good: '"모으는 행동과 묻는 행동은 같은 세션 안에서 닫는다"' },
];

const collectionMethods = [
  { icon: '🔍', title: '딥리서치', desc: 'AI가 웹을 직접 돌아다니며 자료를 수집하고 소스로 자동 추가합니다. 한 번에 8~15개의 소스가 쌓입니다.', when: '노트북에 자료가 부족한 시점, 심층 자료가 필요할 때' },
  { icon: '🌐', title: '크롬 확장', desc: '"NotebookLM Web Importer"를 설치하면 웹 페이지를 한 클릭으로 소스에 추가합니다. 경쟁사 분석에 유용합니다.', when: '특정 페이지를 골라서 수집할 때, 경쟁사 공식 사이트 분석' },
  { icon: '📹', title: '유튜브 영상', desc: '영상 URL을 소스에 추가하면 자막을 자동 인식합니다. 시장 분석적 영상, 10~20분 회고/인터뷰가 특히 유용합니다.', when: '사용자 표현/어휘 채굴, 업계 회고·분석 콘텐츠 수집' },
];

const workarounds = [
  { blocked: 'PDF 전용 사이트', fix: 'PDF 다운로드 → 소스 추가 → 파일 업로드' },
  { blocked: '무한 스크롤 / SPA', fix: '끝까지 스크롤 → Ctrl+P → PDF로 저장 → 업로드' },
  { blocked: '로그인 벽', fix: '로그인 후 인쇄 → PDF로 저장 → 업로드' },
  { blocked: '이미지 안의 글자', fix: 'Gemini/구글 렌즈로 텍스트 변환 → 텍스트 소스로 붙여넣기' },
  { blocked: 'PDF를 잘 못 읽을 때', fix: 'Gemini에서 PDF를 마크다운으로 변환 → 텍스트로 입력' },
];

const sections = [
  { id: 'setup', label: '첫 노트북 만들기' },
  { id: 'collection', label: '자료 수집 3가지 방법' },
  { id: 'workarounds', label: '못 읽히는 자료 우회법' },
  { id: 'tips', label: '초보자 필수 팁' },
  { id: 'mistakes', label: '흔한 실수' },
  { id: 'next', label: '다음 단계' },
];

const Guide = (): ReactElement => {
  const [activeSection, setActiveSection] = useState('setup');
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
      <SEOHead title="시작 가이드" description="NotebookLM을 처음 사용하는 분을 위한 시작 가이드. 사전 준비부터 첫 노트북 만들기까지." path="/guide" />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">GETTING STARTED</span>
          <h1 className="page-title">시작 가이드</h1>
          <p className="page-description">NotebookLM을 처음 사용하는 분을 위한 빠른 시작 안내</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="page-sidebar-layout">
            {/* Left Sidebar */}
            <aside className="page-sidebar">
              <nav className="page-sidebar-nav">
                {sections.map((s) => (
                  <button key={s.id} className={`nav-item${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>
                    <span className="nav-dot"></span>
                    {s.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Right Content */}
            <div className="page-main">
              {/* 첫 노트북 만들기 */}
              <div id="setup" ref={setSectionRef('setup')} className="content-section">
                <span className="content-section-badge">SETUP</span>
                <h2 className="content-section-title">첫 노트북 만들기</h2>
                <p className="content-section-desc">4단계로 바로 시작할 수 있습니다</p>
                <div className="steps-timeline">
                  {setupSteps.map((step, i) => (
                    <div className="step fade-in" key={i} ref={setFadeRef}>
                      <div className="step-marker"><span>{step.num}</span></div>
                      <div className="step-content">
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 자료 수집 3가지 방법 */}
              <div id="collection" ref={setSectionRef('collection')} className="content-section">
                <span className="content-section-badge">COLLECTION</span>
                <h2 className="content-section-title">자료 수집 3가지 방법</h2>
                <p className="content-section-desc">노트북에 자료를 모으는 세 가지 경로 (CH.2에서 상세히 배웁니다)</p>
                <div className="guide-tips-grid">
                  {collectionMethods.map((m, i) => (
                    <div className="guide-tip-card fade-in" key={i} ref={setFadeRef}>
                      <div className="guide-tip-number">{m.icon}</div>
                      <h3>{m.title}</h3>
                      <p>{m.desc}</p>
                      <div className="step-tip" style={{ marginTop: '12px' }}>
                        <span className="tip-badge">언제 쓸까</span>
                        <p>{m.when}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 못 읽히는 자료 우회법 */}
              <div id="workarounds" ref={setSectionRef('workarounds')} className="content-section">
                <span className="content-section-badge">WORKAROUNDS</span>
                <h2 className="content-section-title">못 읽히는 자료 우회법</h2>
                <p className="content-section-desc">NotebookLM에 직접 넣을 수 없는 자료를 우회하는 5가지 방법</p>
                <div className="mistakes-grid fade-in" ref={setFadeRef}>
                  <div className="mistakes-header">
                    <span>막히는 형태</span>
                    <span>우회 방법</span>
                  </div>
                  {workarounds.map((w, i) => (
                    <div className="mistakes-row" key={i}>
                      <div className="mistake-bad"><span className="mistake-x">🔒</span> {w.blocked}</div>
                      <div className="mistake-good"><span className="mistake-check">→</span> {w.fix}</div>
                    </div>
                  ))}
                </div>
                <div className="step-tip" style={{ marginTop: '16px' }}>
                  <span className="tip-badge">저작권 참고</span>
                  <p>내 노트북에 자료를 넣는 것 = 사적 메모 (문제 없음). 그 자료를 외부 문서에 옮겨 적는 것 = 저작권 검토 필요. 공공데이터(통계청, data.go.kr)는 출처만 표기하면 자유 활용 가능합니다.</p>
                </div>
              </div>

              {/* 초보자 팁 */}
              <div id="tips" ref={setSectionRef('tips')} className="content-section">
                <span className="content-section-badge">TIPS</span>
                <h2 className="content-section-title">초보자 필수 팁 5가지</h2>
                <p className="content-section-desc">처음부터 알았으면 좋았을 핵심 노하우</p>
                <div className="guide-tips-grid">
                  {beginnerTips.map((tip, i) => (
                    <div className="guide-tip-card fade-in" key={i} ref={setFadeRef}>
                      <div className="guide-tip-number">{tip.icon}</div>
                      <h3>{tip.title}</h3>
                      <p>{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 흔한 실수 */}
              <div id="mistakes" ref={setSectionRef('mistakes')} className="content-section">
                <span className="content-section-badge">AVOID</span>
                <h2 className="content-section-title">흔한 실수 & 올바른 방법</h2>
                <div className="mistakes-grid fade-in" ref={setFadeRef}>
                  <div className="mistakes-header">
                    <span>흔한 실수</span>
                    <span>올바른 방법</span>
                  </div>
                  {commonMistakes.map((m, i) => (
                    <div className="mistakes-row" key={i}>
                      <div className="mistake-bad"><span className="mistake-x">✗</span> {m.bad}</div>
                      <div className="mistake-good"><span className="mistake-check">✓</span> {m.good}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 다음 단계 */}
              <div id="next" ref={setSectionRef('next')} className="content-section">
                <span className="content-section-badge">NEXT STEP</span>
                <h2 className="content-section-title">더 깊이 배우고 싶다면?</h2>
                <p className="content-section-desc">DreamIT Biz의 7개 챕터 커리큘럼으로 체계적으로 학습하세요.</p>
                <div className="cta-actions" style={{ justifyContent: 'flex-start' }}>
                  <Link to="/curriculum" className="btn btn-primary">커리큘럼 보기</Link>
                  <a href="https://notebooklm.google/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">NotebookLM 시작하기</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Guide;
