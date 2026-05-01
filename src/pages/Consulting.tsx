import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import type { ReactElement } from 'react';

/* ─── Data ─── */

const trainingPrograms = [
  { icon: '⚡', title: '4시간 단기 강의', desc: 'NotebookLM 기본기와 핵심 기법을 빠르게 체험합니다.', items: ['CH.1 기본기 실습', 'Studio 기능 체험', '딥리서치 실습 1회', '산출물: 첫 번째 노트북'] },
  { icon: '📖', title: '8시간 실전 과정', desc: 'CH.1~CH.4까지 자료 수집과 검증 과정을 깊이 있게 다룹니다.', items: ['CH.1~CH.4 전 과정', '자료 수집 및 분류 실습', '페르소나 구축 및 검증', '산출물: 시장 분석 보고서'] },
  { icon: '🏆', title: '16시간 집중 워크숍', desc: '전 7개 챕터를 다루며 사업계획서와 IR Deck을 완성합니다.', items: ['CH.1~CH.7 전 과정', '사업계획서 7절 완성', 'IR Deck 10슬라이드 완성', '산출물: 사업계획서 + IR Deck'], featured: true },
  { icon: '🎯', title: '맞춤형 프로그램', desc: '기업의 업무 프로세스와 니즈에 맞춰 커리큘럼을 설계합니다.', items: ['업무 프로세스 분석', '맞춤 커리큘럼 설계', '팀 교육 & 온보딩', '지속적 지원 & 컨설팅'] },
];

const consultingProcess = [
  { num: '01', title: '니즈 분석', desc: '기업의 현재 업무 프로세스와 요구사항을 분석합니다.' },
  { num: '02', title: '워크플로 설계', desc: 'NotebookLM을 활용한 최적화된 워크플로를 설계합니다.' },
  { num: '03', title: '팀 교육', desc: '설계된 워크플로를 기반으로 팀원 교육을 진행합니다.' },
  { num: '04', title: '지속 지원', desc: '도입 후 지속적인 피드백과 개선을 지원합니다.' },
];

const pricingPlans = [
  { name: '무료', price: '$0', period: '/월', desc: '개인 학습과 기본 리서치에 충분', items: ['노트북 100개', '노트북당 소스 50개', '일일 질문 50회', '일일 오디오 생성 3회', '전체 Studio 기능'], btnLabel: '무료로 시작하기', btnClass: 'btn btn-outline btn-full', featured: false },
  { name: 'Plus', price: '$19.99', period: '/월', desc: 'Google One AI Premium (학생 50% 할인)', items: ['노트북 500개', '노트북당 소스 300개', '일일 질문 500회', '일일 오디오 생성 20회', '팀 협업 기능'], btnLabel: 'Plus 시작하기', btnClass: 'btn btn-primary btn-full', featured: true, badge: '추천' },
];

const faqItems = [
  { q: 'NotebookLM은 무료인가요?', a: '네, 기본 기능은 무료입니다. 노트북 100개, 소스 50개/노트북, 일일 질문 50회, 오디오 3회를 무료로 이용할 수 있습니다. Plus 플랜($19.99/월)은 Google One AI Premium 구독으로 이용 가능합니다.' },
  { q: '일반 AI 챗봇과 뭐가 다른가요?', aJsx: 'chatbot' as const },
  { q: '한국어를 지원하나요?', a: '네, 한국어 PDF/텍스트 인식과 한국어 음성 팟캐스트를 지원합니다. 설정에서 출력 언어를 \'한국어\'로 변경하면 됩니다.' },
  { q: 'NotebookLM의 환각(Hallucination) 문제는 없나요?', a: '완전히 없지는 않습니다. 숫자의 단위와 연도를 바꿔 적거나, "전망된다"를 "이다"로 옮기는 경우가 있습니다. 숫자가 들어간 문장은 반드시 인용 원문에서 단위와 연도까지 확인하는 습관이 필요합니다.' },
  { q: 'DreamIT Biz 교육은 어떻게 신청하나요?', aJsx: 'apply' as const },
  { q: '기업 컨설팅은 어떤 내용인가요?', a: '기업의 기존 업무 프로세스를 분석하고, NotebookLM을 활용한 효율적인 워크플로를 설계합니다. 시장 조사, 보고서 작성, 경쟁사 분석 등 실무에 바로 적용 가능한 맞춤형 프로세스를 구축하며, 팀 교육과 온보딩까지 지원합니다.' },
];

/* ─── Component ─── */

const Consulting = (): ReactElement => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);
  const location = useLocation();

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

  // Handle #faq hash scroll
  useEffect(() => {
    if (location.hash === '#faq') {
      setTimeout(() => {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location.hash]);

  const toggleFaq = (idx: number) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

  return (
    <>
      <SEOHead title="교육 & 컨설팅" description="DreamIT Biz의 NotebookLM 교육 프로그램과 기업 컨설팅. 4시간 단기부터 16시간 집중 워크숍까지." path="/consulting" />

      {/* page-header */}
      <section className="page-header">
        <div className="container">
          <span className="section-badge">TRAINING & CONSULTING</span>
          <h1 className="section-title">교육 & 컨설팅</h1>
          <p className="section-desc">DreamIT Biz와 함께 NotebookLM을 실무에 적용하세요</p>
        </div>
      </section>

      {/* Section 1: DreamIT Biz 소개 */}
      <section className="section">
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

      {/* Section 2: 교육 프로그램 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">PROGRAMS</span>
            <h2 className="section-title">교육 프로그램</h2>
            <p className="section-desc">기업 상황에 맞춰 선택하실 수 있습니다</p>
          </div>
          <div className="training-programs-grid">
            {trainingPrograms.map((prog, i) => (
              <div className={`training-card fade-in${prog.featured ? ' training-featured' : ''}`} key={i} ref={setFadeRef}>
                {prog.featured && <span className="pricing-badge">추천</span>}
                <div className="training-icon">{prog.icon}</div>
                <h3>{prog.title}</h3>
                <p>{prog.desc}</p>
                <ul className="feature-list">
                  {prog.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: 기업 컨설팅 프로세스 */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">PROCESS</span>
            <h2 className="section-title">기업 컨설팅 프로세스</h2>
            <p className="section-desc">체계적인 4단계 프로세스로 도입을 지원합니다</p>
          </div>
          <div className="consulting-process">
            {consultingProcess.map((step, i) => (
              <div className="process-step fade-in" key={i} ref={setFadeRef}>
                <div className="process-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < consultingProcess.length - 1 && <div className="process-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: 요금제 */}
      <section className="section section-alt" id="pricing">
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

      {/* Section 5: FAQ */}
      <section className="section" id="faq">
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
                  {faq.aJsx === 'chatbot' ? (
                    <p>ChatGPT, Claude, Gemini 같은 범용 챗봇은 학습 데이터에 들어 있는 일반 지식으로 답합니다. NotebookLM은 <strong>사용자가 올린 자료만 근거로 답하며</strong>, 모든 답변에 인용 번호가 붙어 출처를 바로 확인할 수 있습니다. 사업계획서처럼 출처가 곧 신뢰인 문서를 만들 때 결정적인 차이입니다.</p>
                  ) : faq.aJsx === 'apply' ? (
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

export default Consulting;
