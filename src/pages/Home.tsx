import { useState, useEffect, useRef, useCallback } from 'react';
import SEOHead from '../components/SEOHead';
import site from '../config/site';
import type { ReactElement } from 'react';

/* ─── Data ─── */

const aboutCards = [
  { icon: '🎯', title: '인용 추적 시스템', desc: '답변 문장 끝에 작은 번호가 표시되고, 클릭하면 원본 소스의 정확한 위치로 이동합니다. 사업계획서나 IR Deck처럼 출처가 곧 신뢰인 문서를 만들 때 결정적입니다.' },
  { icon: '📑', title: '세 칸 인터페이스', desc: '왼쪽에 자료를 넣으면(소스), 가운데에서 그 자료에 대해 대화하고(채팅), 오른쪽에서 다양한 형태로 가공합니다(Studio). 이 흐름은 출시 이후 거의 그대로입니다.' },
  { icon: '🔗', title: 'Google 생태계 연동', desc: '같은 Google 계정, 같은 Drive, 같은 Docs로 묶여 있어 Gemini와의 분업이 매끄럽습니다. 구글 시트 내보내기, PPTX 변환이 두 클릭으로 끝납니다.' },
];

const features = [
  { num: '01', icon: '🎙️', title: 'Audio Overview', desc: '두 명의 AI 진행자가 대화하듯 자료를 풀어주는 팟캐스트. 한국어 음성도 지원됩니다.', list: ['영어/한국어 팟캐스트 생성', 'VC 대화 시뮬레이션 가능', '이동 중 자료 복습용'] },
  { num: '02', icon: '🗺️', title: '마인드맵 & 인포그래픽', desc: '자료의 구조를 한 화면으로 시각화합니다. 핵심 내용을 한 장 이미지로 정리할 수 있습니다.', list: ['자료 구조 자동 시각화', '한 장 인포그래픽 생성', '발표 자료에 바로 활용'] },
  { num: '03', icon: '📊', title: '슬라이드 & 보고서', desc: '자료를 슬라이드 덱이나 장문 리포트로 변환합니다. 구글 시트 연동으로 표도 쉽게 내보냅니다.', list: ['슬라이드 자료 자동 생성', '깊이 있는 리포트 작성', '구글 시트 연동 데이터 표'] },
  { num: '04', icon: '🎬', title: '동영상 개요', desc: '자료를 5~10분짜리 영상으로 변환합니다. 80개 언어 지원으로 글로벌 콘텐츠 제작이 가능합니다.', list: ['5~10분 영상 자동 생성', '80개 언어 지원', 'Google Flow와 연계'] },
  { num: '05', icon: '🔍', title: '딥리서치 & 패스트리서치', desc: 'AI가 웹을 직접 돌아다니며 자료를 모아 소스로 자동 추가합니다. 한 번에 자료 8~15개가 쌓입니다.', list: ['웹 자동 탐색 & 소스 추가', '고품질 자료 자동 수집', '딥 vs 패스트 용도 구분'] },
  { num: '06', icon: '📝', title: '퀴즈 & 플래시카드', desc: '학습용 문제와 플래시카드를 자동으로 생성합니다. 교육 현장에서 바로 활용할 수 있습니다.', list: ['자료 기반 퀴즈 생성', '플래시카드 자동 제작', '학습 가이드 & 요약'] },
];

const steps = [
  {
    num: 1,
    title: '노트북 생성 & 소스 업로드',
    descJsx: true as const,
    details: [
      { label: '지원 소스 형식', items: ['PDF, Word, PowerPoint, 텍스트', 'Google Docs, Google Slides', '웹사이트 URL, YouTube 영상', '직접 텍스트 입력'] },
    ],
    tip: { badge: '핵심 원칙', hasStrong: true as const },
  },
  {
    num: 2,
    title: '채팅으로 질문하기',
    desc: '가운데 채팅 영역에서 자료에 대해 자유롭게 질문합니다. 모든 답변에 인용 번호가 붙습니다.',
    example: { badge: '좋은 질문 예시', text: '"이 5개 회사의 가격 정책을 회사 · 요금제 · 월 가격 · 차별 조항으로 표를 만들어줘. 출처는 회사명 옆에 인용 번호로 표시해줘."' },
    tip: { badge: 'TIP', hasStrong: true as const },
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

const curriculum = [
  { ch: 'CH.1', title: 'NotebookLM 30분 기본기', desc: '인터페이스 세 칸(소스 / 채팅 / Studio)의 관계를 이해하고, 왜 NotebookLM이 다른 챗봇과 다른지 체감합니다.', topics: ['소스 → 채팅 → Studio 흐름', '근거자료 기반 답변의 차이', '페르소나 설정 (10,000자)', 'Gemini 연동 활용'], tag: '입문' },
  { ch: 'CH.2', title: '시장 자료 모으기', desc: '딥리서치, 크롬 확장, 유튜브를 활용해 노트북에 자료를 체계적으로 수집하고 신뢰도를 검증합니다.', topics: ['딥리서치로 자료 자동 수집', '크롬 확장으로 경쟁사 분석', '유튜브 영상 시장 분석', 'A/B/C 등급 신뢰도 검증', '못 읽히는 자료 우회법'], tag: '자료 수집' },
  { ch: 'CH.3', title: '사용자와 시장 정의', desc: '디자인 씽킹으로 페르소나를 만들고, TAM/SAM/SOM을 산정하며, SWOT을 분석합니다.', topics: ['디자인 씽킹 5단계 활용', '출처 있는 페르소나 구축', '고객 여정 지도(CJM)', 'TAM · SAM · SOM 산정', '경쟁사 비교 & SWOT'], tag: '시장 분석' },
  { ch: 'CH.4', title: '소스 선별 & 페르소나 검증', desc: '핵심 소스만 골라서 채팅하고, VC/고객/멘토 시야로 다각도 검증합니다.', topics: ['소스 체크박스 선별 채팅', '핵심 소스 4가지 기준', 'VC · 고객 · 멘토 페르소나', 'Audio Overview 피드백'], tag: '검증' },
  { ch: 'CH.5', title: 'BM과 분석 자료 만들기', desc: '데이터 표를 구글 시트로 연동하고, BM 캔버스 9칸과 단위경제를 작성합니다.', topics: ['표 만들기 5칸 프롬프트', '구글 시트 연동', 'BM 캔버스 9칸', 'CAC / ARPU / LTV 시트'], tag: '비즈니스' },
  { ch: 'CH.6', title: '사업계획서 & IR Deck', desc: '사업계획서 7절을 한 통의 프롬프트로 초안 작성하고, IR Deck 10슬라이드를 완성합니다.', topics: ['사업계획서 7절 구조', 'Gemini로 다듬기', 'IR Deck 10슬라이드', '한 슬라이드 한 메시지'], tag: '산출물' },
];

const curriculumSpecial = {
  ch: 'CH.7', title: '부록: 실전 활용 & 워크숍', desc: 'Google Flow로 30초 애니메이션 제작, 수업 현장 활용법, 회사 스타일 발표 자료 만들기 등 실전 노하우를 다룹니다.', topics: ['Google Flow 애니메이션 제작', '수업 현장 활용 가이드 (4h~16h)', '회사 스타일 발표 자료 만들기'], tag: '부록',
};

interface WorkflowBeforeAfter { icon: string; title: string; desc: string; type: 'before-after'; badLabel?: string; goodLabel?: string; bad: string; good: string }
interface WorkflowTable { icon: string; title: string; desc: string; type: 'table'; rows: { grade: string; cls: string; def: string; ex: string }[] }
interface WorkflowPersonas { icon: string; title: string; desc: string; type: 'personas'; personas: { label: string; cls: string }[] }
interface WorkflowChips { icon: string; title: string; desc: string; type: 'chips'; chips: string[] }
type WorkflowCard = WorkflowBeforeAfter | WorkflowTable | WorkflowPersonas | WorkflowChips;

const workflowCards: WorkflowCard[] = [
  { icon: '🔬', title: '딥리서치 질문 설계', desc: '좋은 질문의 4가지 공통점: 범위가 좁고, 조사 대상이 명시되고, 결과 형태가 정해져 있고, 검증 가능한 사실 위주.', type: 'before-after', bad: '"온라인 교육 시장은 어때?"', good: '"한국에서 비전공자 대상 코딩 교육 VOD 플랫폼의 2024~2025년 시장 규모와 주요 사업자 5곳을 조사해 줘."' },
  { icon: '🏷️', title: '자료 신뢰도 등급제', desc: '모든 소스를 A/B/C 세 등급으로 분류합니다. A등급만 사업계획서에 직접 인용하고, C등급은 참고용으로만 사용합니다.', type: 'table', rows: [{ grade: 'A', cls: 'wf-a', def: '1차 출처 / 공인기관', ex: '통계청, 정부 보고서' }, { grade: 'B', cls: 'wf-b', def: '2차 가공, 책임주체 분명', ex: '일간지, 산업 리포트' }, { grade: 'C', cls: 'wf-c', def: '출처 흐림 / 과도한 가공', ex: '블로그, 위키피디아' }] },
  { icon: '👤', title: '출처 있는 페르소나', desc: '좋은 페르소나와 나쁜 페르소나의 차이는 단 하나 — 출처. NotebookLM의 인용 기능으로 속성마다 근거를 붙입니다.', type: 'before-after', badLabel: '나쁜 예', goodLabel: '좋은 예', bad: '"박지훈, 29세, 마케터, 코딩을 배우고 싶다"', good: '"박지훈, 29세 (출처: 사람인 2025 직무전환 설문 p.8). 데이터 분석 역량을 키우고 싶어하는 비전공자"' },
  { icon: '🎭', title: '다각도 페르소나 검증', desc: '같은 가설을 VC, 고객, 멘토 세 시야에서 검증합니다. 10,000자까지 지시문 작성이 가능합니다.', type: 'personas', personas: [{ label: 'VC: 숫자와 시장 위험을 본다', cls: 'vc' }, { label: '고객: 결정의 순간과 가격을 본다', cls: 'customer' }, { label: '멘토: 다음 한 발의 방향을 본다', cls: 'mentor' }] },
  { icon: '📊', title: '사업계획서 7절 구조', desc: '어느 양식을 받든 사업계획서는 7가지 질문으로 압축됩니다. NotebookLM이 모은 부품으로 각 절을 채웁니다.', type: 'chips', chips: ['1. 문제', '2. 해결', '3. 시장', '4. BM', '5. 실행', '6. 팀', '7. 재무'] },
  { icon: '🎬', title: 'IR Deck 10슬라이드', desc: '한 슬라이드 한 메시지 원칙. 헤드라인 15자 이내 + 본문 두 줄 + 근거 숫자 한 개. 총 100자 안쪽이 핵심입니다.', type: 'chips', chips: ['커버', '문제', '해결', '제품', '시장', '경쟁', 'BM', '성장', '팀', '요청'] },
];

const pricingPlans = [
  { name: '무료', price: '$0', period: '/월', desc: '개인 학습과 기본 리서치에 충분', items: ['노트북 100개', '노트북당 소스 50개', '일일 질문 50회', '일일 오디오 생성 3회', '전체 Studio 기능'], btnLabel: '무료로 시작하기', btnClass: 'btn btn-outline btn-full', featured: false },
  { name: 'Plus', price: '$19.99', period: '/월', desc: 'Google One AI Premium (학생 50% 할인)', items: ['노트북 500개', '노트북당 소스 300개', '일일 질문 500회', '일일 오디오 생성 20회', '팀 협업 기능'], btnLabel: 'Plus 시작하기', btnClass: 'btn btn-primary btn-full', featured: true, badge: '추천' },
];

const faqItems = [
  { q: 'NotebookLM은 무료인가요?', a: '네, 기본 기능은 무료입니다. 노트북 100개, 소스 50개/노트북, 일일 질문 50회, 오디오 3회를 무료로 이용할 수 있습니다. Plus 플랜($19.99/월)은 Google One AI Premium 구독으로 이용 가능합니다.' },
  { q: '일반 AI 챗봇과 뭐가 다른가요?', aJsx: true as const },
  { q: '한국어를 지원하나요?', a: '네, 한국어 PDF/텍스트 인식과 한국어 음성 팟캐스트를 지원합니다. 설정에서 출력 언어를 \'한국어\'로 변경하면 됩니다.' },
  { q: 'NotebookLM의 환각(Hallucination) 문제는 없나요?', a: '완전히 없지는 않습니다. 숫자의 단위와 연도를 바꿔 적거나, "전망된다"를 "이다"로 옮기는 경우가 있습니다. 숫자가 들어간 문장은 반드시 인용 원문에서 단위와 연도까지 확인하는 습관이 필요합니다.' },
  { q: 'DreamIT Biz 교육은 어떻게 신청하나요?', aJsx: true as const },
  { q: '기업 컨설팅은 어떤 내용인가요?', a: '기업의 기존 업무 프로세스를 분석하고, NotebookLM을 활용한 효율적인 워크플로를 설계합니다. 시장 조사, 보고서 작성, 경쟁사 분석 등 실무에 바로 적용 가능한 맞춤형 프로세스를 구축하며, 팀 교육과 온보딩까지 지원합니다.' },
];

/* ─── Helpers ─── */

const scrollTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

/* ─── Component ─── */

const Home = (): ReactElement => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
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

  const toggleFaq = (idx: number) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

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
              <a href="#curriculum" onClick={scrollTo('curriculum')} className="btn btn-primary">커리큘럼 보기</a>
              <a href="#consulting" onClick={scrollTo('consulting')} className="btn btn-outline">교육 문의하기</a>
            </div>
            <div className="hero-stats">
              <div className="stat"><span className="stat-number">7</span><span className="stat-label">챕터 커리큘럼</span></div>
              <div className="stat"><span className="stat-number">실전</span><span className="stat-label">사업계획서 완성</span></div>
              <div className="stat"><span className="stat-number">맞춤</span><span className="stat-label">기업 컨설팅</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">ABOUT</span>
            <h2 className="section-title">NotebookLM이란?</h2>
            <p className="section-desc">Google Gemini 기반의 AI 리서치 도구 — 내 자료만 학습하는 나만의 AI 비서</p>
          </div>
          <div className="about-grid">
            <div className="about-card about-main fade-in" ref={setFadeRef}>
              <div className="about-icon">🤖</div>
              <h3>내 자료만 근거로 답하는 AI</h3>
              <p>NotebookLM은 구글이 Gemini 모델을 기반으로 만든 AI 리서치 도구입니다. 일반 챗봇과 달리 <strong>사용자가 업로드한 문서만을 바탕으로 답변을 생성</strong>합니다. 모든 답변에 인용 번호가 붙어 출처를 바로 확인할 수 있으며, 이것이 다른 AI 도구와의 결정적 차이입니다.</p>
            </div>
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

      {/* Features */}
      <section className="section section-alt" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">FEATURES</span>
            <h2 className="section-title">Studio 패널 기능</h2>
            <p className="section-desc">같은 자료를 다양한 형태로 가공하는 NotebookLM의 핵심 기능</p>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How-to Steps */}
      <section className="section" id="howto">
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

      {/* Curriculum */}
      <section className="section section-alt" id="curriculum">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CURRICULUM</span>
            <h2 className="section-title">7개 챕터 교육 과정</h2>
            <p className="section-desc">DreamIT Biz가 설계한 체계적 NotebookLM 실전 커리큘럼</p>
          </div>
          <div className="curriculum-grid">
            {curriculum.map((c, i) => (
              <div className="curriculum-card fade-in" key={i} ref={setFadeRef}>
                <div className="curriculum-chapter">{c.ch}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <ul className="curriculum-topics">
                  {c.topics.map((t, j) => <li key={j}>{t}</li>)}
                </ul>
                <span className="curriculum-tag">{c.tag}</span>
              </div>
            ))}
            <div className="curriculum-card curriculum-card-special fade-in" ref={setFadeRef}>
              <div className="curriculum-chapter">{curriculumSpecial.ch}</div>
              <h3>{curriculumSpecial.title}</h3>
              <p>{curriculumSpecial.desc}</p>
              <ul className="curriculum-topics">
                {curriculumSpecial.topics.map((t, j) => <li key={j}>{t}</li>)}
              </ul>
              <span className="curriculum-tag">{curriculumSpecial.tag}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow / Key Techniques */}
      <section className="section" id="workflow">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">KEY TECHNIQUES</span>
            <h2 className="section-title">교육 핵심 기법</h2>
            <p className="section-desc">DreamIT Biz 교육 과정에서 배우는 NotebookLM 실전 기법</p>
          </div>
          <div className="workflow-grid">
            {workflowCards.map((w, i) => (
              <div className="workflow-card fade-in" key={i} ref={setFadeRef}>
                <div className="workflow-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
                {w.type === 'before-after' && (
                  <div className="workflow-example">
                    <div className="workflow-bad">
                      <span>{w.badLabel || 'Before'}</span>
                      <p>{w.bad}</p>
                    </div>
                    <div className="workflow-good">
                      <span>{w.goodLabel || 'After'}</span>
                      <p>{w.good}</p>
                    </div>
                  </div>
                )}
                {w.type === 'table' && (
                  <div className="workflow-table">
                    <div className="wf-row wf-header">
                      <span>등급</span><span>정의</span><span>예시</span>
                    </div>
                    {w.rows.map((r, j) => (
                      <div className={`wf-row ${r.cls}`} key={j}>
                        <span>{r.grade}</span><span>{r.def}</span><span>{r.ex}</span>
                      </div>
                    ))}
                  </div>
                )}
                {w.type === 'personas' && (
                  <div className="workflow-personas">
                    {w.personas.map((p, j) => (
                      <div className={`persona-chip ${p.cls}`} key={j}>{p.label}</div>
                    ))}
                  </div>
                )}
                {w.type === 'chips' && (
                  <div className="workflow-steps-mini">
                    {w.chips.map((c, j) => <span key={j}>{c}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company & Services */}
      <section className="section section-alt" id="consulting">
        <div className="container">
          <div className="company-intro">
            <div className="company-info">
              <span className="section-badge">DreamIT Biz</span>
              <h2 className="section-title">드림아이티비즈</h2>
              <p>웹개발, 디자인, 교육, 기업컨설팅 전문 기업.<br />NotebookLM 교육 과정 설계와 기업 맞춤 컨설팅을 제공합니다.</p>
              <div className="company-services">
                {['웹개발', '디자인', '교육', '기업컨설팅', '출판'].map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <a href="https://dreamitbiz.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">DreamIT Biz 방문</a>
            </div>
            <div className="company-cards">
              <div className="company-card fade-in" ref={setFadeRef}>
                <h4>교육 과정</h4>
                <p>7개 챕터 체계적 커리큘럼. 4h 단기부터 16h 집중 워크숍까지.</p>
              </div>
              <div className="company-card fade-in" ref={setFadeRef}>
                <h4>기업 컨설팅</h4>
                <p>NotebookLM 기반 업무 프로세스 분석 및 맞춤 워크플로 설계.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">NOTEBOOKLM PLAN</span>
            <h2 className="section-title">NotebookLM 요금제</h2>
            <p className="section-desc">Google NotebookLM의 무료 vs Plus 플랜 비교</p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan, i) => (
              <div className={`pricing-card fade-in${plan.featured ? ' pricing-featured' : ''}`} key={i} ref={setFadeRef}>
                {plan.featured && <span className="pricing-badge">{plan.badge}</span>}
                <div className="pricing-header">
                  <h3>{plan.name}</h3>
                  <div className="pricing-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  <p className="pricing-desc">{plan.desc}</p>
                </div>
                <ul className="pricing-features">
                  {plan.items.map((item, j) => (
                    <li key={j}><span className="check">✓</span> {item}</li>
                  ))}
                </ul>
                <a href="https://notebooklm.google/" target="_blank" rel="noopener noreferrer" className={plan.btnClass}>{plan.btnLabel}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-alt" id="faq">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">FAQ</span>
            <h2 className="section-title">자주 묻는 질문</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((faq, i) => (
              <div className={`faq-item fade-in${activeIdx === i ? ' active' : ''}`} key={i} ref={setFadeRef}>
                <button className="faq-question" aria-expanded={activeIdx === i} onClick={() => toggleFaq(i)}>
                  <span>{faq.q}</span>
                  <span className="faq-toggle">+</span>
                </button>
                <div className="faq-answer">
                  {i === 1 ? (
                    <p>ChatGPT, Claude, Gemini 같은 범용 챗봇은 학습 데이터에 들어 있는 일반 지식으로 답합니다. NotebookLM은 <strong>사용자가 올린 자료만 근거로 답하며</strong>, 모든 답변에 인용 번호가 붙어 출처를 바로 확인할 수 있습니다. 사업계획서처럼 출처가 곧 신뢰인 문서를 만들 때 결정적인 차이입니다.</p>
                  ) : i === 4 ? (
                    <p>DreamIT Biz 공식 홈페이지(<a href="https://dreamitbiz.com" target="_blank" rel="noopener noreferrer">dreamitbiz.com</a>)에서 온라인 교육 신청과 기업 워크숍/컨설팅 문의가 가능합니다. 4시간 단기 강의부터 16시간 집중 워크숍까지 기업 상황에 맞춰 설계해 드립니다.</p>
                  ) : (
                    <p>{faq.a}</p>
                  )}
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
