import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import type { ReactElement } from 'react';

/* ─── Types ─── */

interface WorkflowBeforeAfter { icon: string; title: string; desc: string; type: 'before-after'; badLabel?: string; goodLabel?: string; bad: string; good: string; why: string; tips: string[] }
interface WorkflowTable { icon: string; title: string; desc: string; type: 'table'; rows: { grade: string; cls: string; def: string; ex: string }[]; why: string; tips: string[] }
interface WorkflowPersonas { icon: string; title: string; desc: string; type: 'personas'; personas: { label: string; cls: string }[]; why: string; tips: string[] }
interface WorkflowChips { icon: string; title: string; desc: string; type: 'chips'; chips: string[]; why: string; tips: string[] }
type WorkflowCard = WorkflowBeforeAfter | WorkflowTable | WorkflowPersonas | WorkflowChips;

/* ─── Data ─── */

const workflowCards: WorkflowCard[] = [
  {
    icon: '🔬', title: '딥리서치 질문 설계',
    desc: '좋은 질문의 4가지 공통점: 범위가 좁고, 조사 대상이 명시되고, 결과 형태가 정해져 있고, 검증 가능한 사실 위주.',
    type: 'before-after',
    bad: '"온라인 교육 시장은 어때?"',
    good: '"한국에서 비전공자 대상 코딩 교육 VOD 플랫폼의 2024~2025년 시장 규모와 주요 사업자 5곳을 조사해 줘."',
    why: '딥리서치의 품질은 질문의 구체성에 비례합니다. 막연한 질문은 막연한 결과를, 구체적인 질문은 인용 가능한 데이터를 가져옵니다.',
    tips: ['질문에 연도 범위를 반드시 포함하세요', '조사 대상의 수(예: 5곳)를 명시하세요', '결과 형태(표, 비교, 요약)를 지정하세요'],
  },
  {
    icon: '🏷️', title: '자료 신뢰도 등급제',
    desc: '모든 소스를 A/B/C 세 등급으로 분류합니다. A등급만 사업계획서에 직접 인용하고, C등급은 참고용으로만 사용합니다.',
    type: 'table',
    rows: [
      { grade: 'A', cls: 'wf-a', def: '1차 출처 / 공인기관', ex: '통계청, 정부 보고서' },
      { grade: 'B', cls: 'wf-b', def: '2차 가공, 책임주체 분명', ex: '일간지, 산업 리포트' },
      { grade: 'C', cls: 'wf-c', def: '출처 흐림 / 과도한 가공', ex: '블로그, 위키피디아' },
    ],
    why: '사업계획서와 IR Deck에서 신뢰를 결정하는 것은 내용이 아니라 출처입니다. 등급 분류 없이 모든 소스를 동등하게 인용하면 문서의 신뢰도가 떨어집니다.',
    tips: ['수집 즉시 등급을 매기세요 — 나중에 하면 잊어버립니다', 'A등급이 3개 미만이면 딥리서치를 다시 돌리세요', 'C등급도 아이디어 발굴에는 유용합니다'],
  },
  {
    icon: '👤', title: '출처 있는 페르소나',
    desc: '좋은 페르소나와 나쁜 페르소나의 차이는 단 하나 — 출처. NotebookLM의 인용 기능으로 속성마다 근거를 붙입니다.',
    type: 'before-after',
    badLabel: '나쁜 예',
    goodLabel: '좋은 예',
    bad: '"박지훈, 29세, 마케터, 코딩을 배우고 싶다"',
    good: '"박지훈, 29세 (출처: 사람인 2025 직무전환 설문 p.8). 데이터 분석 역량을 키우고 싶어하는 비전공자"',
    why: '근거 없는 페르소나는 "만들어낸 사람"에 불과합니다. 인용이 있는 페르소나는 VC가 "이 고객이 진짜 있다"고 신뢰하는 근거가 됩니다.',
    tips: ['연령/직업은 설문 데이터에서 인용하세요', '니즈/행동은 인터뷰나 리뷰 데이터를 활용하세요', '하나의 페르소나에 최소 3개 인용을 붙이세요'],
  },
  {
    icon: '🎭', title: '다각도 페르소나 검증',
    desc: '같은 가설을 VC, 고객, 멘토 세 시야에서 검증합니다. 10,000자까지 지시문 작성이 가능합니다.',
    type: 'personas',
    personas: [
      { label: 'VC: 숫자와 시장 위험을 본다', cls: 'vc' },
      { label: '고객: 결정의 순간과 가격을 본다', cls: 'customer' },
      { label: '멘토: 다음 한 발의 방향을 본다', cls: 'mentor' },
    ],
    why: '창업자는 자기 아이디어에 빠지기 쉽습니다. 세 가지 관점에서 같은 가설을 검증하면 맹점을 빠르게 발견할 수 있습니다.',
    tips: ['VC 페르소나에게 "투자하지 않을 이유 3가지"를 물어보세요', '고객 페르소나에게 "이 가격에 구매하겠는가"를 물어보세요', '멘토 페르소나에게 "다음 3개월 우선순위"를 물어보세요'],
  },
  {
    icon: '📊', title: '사업계획서 7절 구조',
    desc: '어느 양식을 받든 사업계획서는 7가지 질문으로 압축됩니다. NotebookLM이 모은 부품으로 각 절을 채웁니다.',
    type: 'chips',
    chips: ['1. 문제', '2. 해결', '3. 시장', '4. BM', '5. 실행', '6. 팀', '7. 재무'],
    why: '사업계획서 양식은 기관마다 다르지만, 핵심 질문은 동일합니다. 7절 프레임워크를 익히면 어떤 양식에도 대응할 수 있습니다.',
    tips: ['각 절마다 NotebookLM에서 해당 소스만 체크하고 질문하세요', '3절(시장)은 A등급 소스만 인용하세요', 'Gemini로 문체와 표현을 다듬으세요'],
  },
  {
    icon: '🎬', title: 'IR Deck 10슬라이드',
    desc: '한 슬라이드 한 메시지 원칙. 헤드라인 15자 이내 + 본문 두 줄 + 근거 숫자 한 개. 총 100자 안쪽이 핵심입니다.',
    type: 'chips',
    chips: ['커버', '문제', '해결', '제품', '시장', '경쟁', 'BM', '성장', '팀', '요청'],
    why: 'IR Deck은 "읽는 문서"가 아니라 "보는 문서"입니다. 한 슬라이드에 메시지가 두 개 이상이면 투자자의 집중력이 분산됩니다.',
    tips: ['헤드라인은 15자 이내로 작성하세요', '본문은 두 줄, 근거 숫자는 한 개만 넣으세요', 'Google Slides로 내보내면 바로 편집 가능합니다'],
  },
];

/* ─── Component ─── */

const Techniques = (): ReactElement => {
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
      <SEOHead title="교육 핵심 기법" description="DreamIT Biz 교육 과정에서 배우는 NotebookLM 6가지 실전 기법. 딥리서치, 신뢰도 등급, 페르소나 검증 등." path="/techniques" />

      {/* page-header */}
      <section className="page-header">
        <div className="container">
          <span className="section-badge">KEY TECHNIQUES</span>
          <h1 className="section-title">교육 핵심 기법</h1>
          <p className="section-desc">DreamIT Biz 교육 과정에서 배우는 NotebookLM 실전 기법</p>
        </div>
      </section>

      {/* Section 1: 기법 개요 */}
      <section className="section">
        <div className="container">
          <div className="about-card about-main fade-in" ref={setFadeRef}>
            <div className="about-icon">🛠️</div>
            <h3>왜 기법이 중요한가?</h3>
            <p>NotebookLM은 도구일 뿐, <strong>좋은 결과를 만드는 것은 기법</strong>입니다. 같은 도구를 사용해도 질문 설계, 자료 분류, 검증 방법에 따라 결과물의 품질이 크게 달라집니다. DreamIT Biz 교육에서는 이 6가지 핵심 기법을 반복 실습합니다.</p>
          </div>
        </div>
      </section>

      {/* Section 2: 6가지 기법 상세 */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">6 TECHNIQUES</span>
            <h2 className="section-title">6가지 핵심 기법</h2>
            <p className="section-desc">각 기법의 원리, 예시, 실전 적용 팁을 확인하세요</p>
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

                {/* Extended content */}
                <div className="technique-extra">
                  <div className="step-tip">
                    <span className="tip-badge">왜 중요한가</span>
                    <p>{w.why}</p>
                  </div>
                  <div className="technique-tips">
                    <strong>실전 적용 팁</strong>
                    <ul>
                      {w.tips.map((tip, j) => <li key={j}>{tip}</li>)}
                    </ul>
                  </div>
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
            <h2>이 기법을 직접 배워보세요</h2>
            <p>DreamIT Biz의 교육 프로그램에서 실전 실습과 피드백을 받을 수 있습니다.</p>
            <div className="cta-actions">
              <Link to="/consulting" className="btn btn-primary btn-lg">교육 문의하기</Link>
              <Link to="/curriculum" className="btn btn-outline btn-lg">커리큘럼 보기</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Techniques;
