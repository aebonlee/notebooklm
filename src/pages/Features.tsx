import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import type { ReactElement } from 'react';

/* ─── Data ─── */

const features = [
  {
    num: '01', icon: '🎙️', title: 'Audio Overview',
    desc: '두 명의 AI 진행자가 대화하듯 자료를 풀어주는 팟캐스트. 한국어 음성도 지원됩니다.',
    list: ['영어/한국어 팟캐스트 생성', 'VC 대화 시뮬레이션 가능', '이동 중 자료 복습용'],
    scenario: '30분 분량의 논문을 10분 팟캐스트로 변환하면, 출퇴근 중에도 핵심 내용을 파악할 수 있습니다.',
    tip: '한국어 설정 시 두 진행자의 어조와 속도가 자연스럽게 조절됩니다.',
    tier: '무료: 3회/일 | Plus: 20회/일',
  },
  {
    num: '02', icon: '🗺️', title: '마인드맵 & 인포그래픽',
    desc: '자료의 구조를 한 화면으로 시각화합니다. 핵심 내용을 한 장 이미지로 정리할 수 있습니다.',
    list: ['자료 구조 자동 시각화', '한 장 인포그래픽 생성', '발표 자료에 바로 활용'],
    scenario: '경쟁사 분석 보고서를 마인드맵으로 변환하면, 한 눈에 시장 구도를 파악할 수 있습니다.',
    tip: '마인드맵 결과를 PNG로 내보내 발표 슬라이드에 바로 삽입하세요.',
    tier: '무료/Plus 동일',
  },
  {
    num: '03', icon: '📊', title: '슬라이드 & 보고서',
    desc: '자료를 슬라이드 덱이나 장문 리포트로 변환합니다. 구글 시트 연동으로 표도 쉽게 내보냅니다.',
    list: ['슬라이드 자료 자동 생성', '깊이 있는 리포트 작성', '구글 시트 연동 데이터 표'],
    scenario: '시장 조사 자료 5개를 업로드하면, 10슬라이드 IR Deck 초안이 자동으로 생성됩니다.',
    tip: 'Google Slides로 직접 내보내기하면 편집이 훨씬 편합니다.',
    tier: '무료/Plus 동일',
  },
  {
    num: '04', icon: '🎬', title: '동영상 개요',
    desc: '자료를 5~10분짜리 영상으로 변환합니다. 80개 언어 지원으로 글로벌 콘텐츠 제작이 가능합니다.',
    list: ['5~10분 영상 자동 생성', '80개 언어 지원', 'Google Flow와 연계'],
    scenario: '교육 자료를 영상으로 변환해 사내 LMS에 업로드하거나, 글로벌 팀에 다국어 버전을 배포하세요.',
    tip: 'Google Flow와 연계하면 30초 애니메이션도 제작 가능합니다.',
    tier: 'Plus 전용',
  },
  {
    num: '05', icon: '🔍', title: '딥리서치 & 패스트리서치',
    desc: 'AI가 웹을 직접 돌아다니며 자료를 모아 소스로 자동 추가합니다. 한 번에 자료 8~15개가 쌓입니다.',
    list: ['웹 자동 탐색 & 소스 추가', '고품질 자료 자동 수집', '딥 vs 패스트 용도 구분'],
    scenario: '"한국 비전공자 코딩 교육 시장" 딥리서치 → 통계청, 산업 보고서, 뉴스 기사 15개가 소스에 자동 추가됩니다.',
    tip: '딥리서치는 깊이 있는 조사, 패스트리서치는 빠른 팩트 체크에 사용하세요.',
    tier: '딥: Plus 전용 | 패스트: 무료',
  },
  {
    num: '06', icon: '📝', title: '퀴즈 & 플래시카드',
    desc: '학습용 문제와 플래시카드를 자동으로 생성합니다. 교육 현장에서 바로 활용할 수 있습니다.',
    list: ['자료 기반 퀴즈 생성', '플래시카드 자동 제작', '학습 가이드 & 요약'],
    scenario: '강의 자료를 업로드하면 객관식 퀴즈 20문항과 핵심 용어 플래시카드가 자동 생성됩니다.',
    tip: '퀴즈를 Google Forms로 내보내면 온라인 시험으로 바로 활용 가능합니다.',
    tier: '무료/Plus 동일',
  },
];

const comparisonRows = [
  { feature: 'Audio Overview', free: '3회/일', plus: '20회/일' },
  { feature: '마인드맵 & 인포그래픽', free: '✓', plus: '✓' },
  { feature: '슬라이드 & 보고서', free: '✓', plus: '✓' },
  { feature: '동영상 개요', free: '—', plus: '✓' },
  { feature: '딥리서치', free: '—', plus: '✓' },
  { feature: '패스트리서치', free: '✓', plus: '✓' },
  { feature: '퀴즈 & 플래시카드', free: '✓', plus: '✓' },
  { feature: '노트북 수', free: '100개', plus: '500개' },
  { feature: '소스/노트북', free: '50개', plus: '300개' },
  { feature: '일일 질문', free: '50회', plus: '500회' },
];

/* ─── Component ─── */

const Features = (): ReactElement => {
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
      <SEOHead title="Studio 패널 기능" description="NotebookLM Studio의 6가지 핵심 기능을 상세히 알아보세요. Audio Overview, 마인드맵, 슬라이드, 딥리서치 등." path="/features" />

      {/* page-header */}
      <section className="page-header">
        <div className="container">
          <span className="page-badge">FEATURES</span>
          <h1 className="page-title">Studio 패널 기능</h1>
          <p className="page-description">같은 자료를 다양한 형태로 가공하는 NotebookLM의 핵심 기능</p>
        </div>
      </section>

      {/* Section 1: Studio 개요 */}
      <section className="section">
        <div className="container">
          <div className="about-card about-main fade-in" ref={setFadeRef}>
            <div className="about-icon">🎨</div>
            <h3>Studio 패널이란?</h3>
            <p>NotebookLM의 오른쪽에 위치한 Studio 패널은 <strong>업로드한 자료를 다양한 형태로 가공</strong>하는 공간입니다. 같은 자료를 팟캐스트, 마인드맵, 슬라이드, 영상, 퀴즈 등으로 변환할 수 있습니다. 채팅으로 얻은 답변을 메모로 저장하면, 이 메모도 Studio의 소스로 활용됩니다.</p>
          </div>
        </div>
      </section>

      {/* Section 2: 6개 기능 상세 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">6 FEATURES</span>
            <h2 className="section-title">Studio 기능 상세</h2>
            <p className="section-desc">각 기능의 용도, 사용 팁, 활용 시나리오를 확인하세요</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card fade-in" key={i} ref={setFadeRef}>
                <div className="feature-number">{f.num}</div>
                <div className="feature-icon-wrap"><span className="feature-icon">{f.icon}</span></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <ul className="feature-list">
                  {f.list.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
                <div className="feature-detail-section">
                  <div className="step-example">
                    <span className="example-badge">활용 시나리오</span>
                    <p>{f.scenario}</p>
                  </div>
                  <div className="step-tip">
                    <span className="tip-badge">TIP</span>
                    <p>{f.tip}</p>
                  </div>
                  <div className="feature-tier">
                    <span>{f.tier}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: 기능 비교 테이블 */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">COMPARISON</span>
            <h2 className="section-title">무료 vs Plus 기능 비교</h2>
            <p className="section-desc">플랜별 제공 기능을 한 눈에 확인하세요</p>
          </div>
          <div className="comparison-table fade-in" ref={setFadeRef}>
            <div className="comp-row comp-header">
              <span>기능</span>
              <span>무료</span>
              <span>Plus ($19.99/월)</span>
            </div>
            {comparisonRows.map((row, i) => (
              <div className={`comp-row${i % 2 === 0 ? ' comp-even' : ''}`} key={i}>
                <span>{row.feature}</span>
                <span>{row.free}</span>
                <span>{row.plus}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>이 기능들을 실전에서 활용하려면?</h2>
            <p>DreamIT Biz의 체계적인 커리큘럼으로 각 기능을 깊이 있게 배우세요.</p>
            <div className="cta-actions">
              <Link to="/curriculum" className="btn btn-primary btn-lg">커리큘럼 보기</Link>
              <Link to="/about" className="btn btn-outline btn-lg">NotebookLM 소개</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
