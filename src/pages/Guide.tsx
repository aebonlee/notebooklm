import { useEffect, useRef, useCallback } from 'react';
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
  { bad: '막연한 질문 ("이거 어때?")', good: '범위, 형식, 개수를 명시한 구체적 질문' },
  { bad: '인용 번호 확인 없이 답변 그대로 사용', good: '숫자/연도/단위는 반드시 원문 대조' },
  { bad: '소스 50개를 전부 체크한 채 질문', good: '관련 소스 5~10개만 선택하여 집중 질문' },
];

const Guide = (): ReactElement => {
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
      <SEOHead title="시작 가이드" description="NotebookLM을 처음 사용하는 분을 위한 시작 가이드. 사전 준비부터 첫 노트북 만들기까지." path="/guide" />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">GETTING STARTED</span>
          <h1 className="page-title">시작 가이드</h1>
          <p className="page-description">NotebookLM을 처음 사용하는 분을 위한 빠른 시작 안내</p>
        </div>
      </section>

      {/* 사전 준비 */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">SETUP</span>
            <h2 className="section-title">첫 노트북 만들기</h2>
            <p className="section-desc">4단계로 바로 시작할 수 있습니다</p>
          </div>
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
      </section>

      {/* 초보자 팁 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">TIPS</span>
            <h2 className="section-title">초보자 필수 팁 5가지</h2>
            <p className="section-desc">처음부터 알았으면 좋았을 핵심 노하우</p>
          </div>
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
      </section>

      {/* 흔한 실수 */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">AVOID</span>
            <h2 className="section-title">흔한 실수 & 올바른 방법</h2>
          </div>
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
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>더 깊이 배우고 싶다면?</h2>
            <p>DreamIT Biz의 7개 챕터 커리큘럼으로 체계적으로 학습하세요.</p>
            <div className="cta-actions">
              <Link to="/curriculum" className="btn btn-primary btn-lg">커리큘럼 보기</Link>
              <a href="https://notebooklm.google/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">NotebookLM 시작하기</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Guide;
