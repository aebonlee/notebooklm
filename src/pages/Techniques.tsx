import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import type { ReactElement } from 'react';

/* ─── Types ─── */

interface WorkflowPrompt { label: string; text: string }
interface WorkflowBase { icon: string; title: string; desc: string; why: string; tips: string[]; prompts?: WorkflowPrompt[] }
interface WorkflowBeforeAfter extends WorkflowBase { type: 'before-after'; badLabel?: string; goodLabel?: string; bad: string; good: string }
interface WorkflowTable extends WorkflowBase { type: 'table'; rows: { grade: string; cls: string; def: string; ex: string; rule: string }[] }
interface WorkflowPersonas extends WorkflowBase { type: 'personas'; personas: { label: string; cls: string }[] }
interface WorkflowChips extends WorkflowBase { type: 'chips'; chips: string[] }
type WorkflowCard = WorkflowBeforeAfter | WorkflowTable | WorkflowPersonas | WorkflowChips;

/* ─── Data ─── */

const workflowCards: WorkflowCard[] = [
  /* ── 1. 딥리서치 질문 설계 ── */
  {
    icon: '🔬', title: '딥리서치 질문 설계',
    desc: '딥리서치는 질문 하나를 받아 웹을 직접 돌아다니며 자료를 모으고, 노트북에 소스로 자동 추가하는 기능입니다. 품질은 질문의 구체성에 비례합니다.',
    type: 'before-after',
    badLabel: '나쁜 질문',
    goodLabel: '좋은 질문',
    bad: '"온라인 교육 시장은 어때?"',
    good: '"한국에서 비전공자·직장인 대상 코딩 교육 VOD 플랫폼의 2024~2025년 시장 규모와 주요 사업자 5곳을 조사해줘. 각 사업자의 가격대, 커리큘럼 구성, 차별점을 정리하고 싶어."',
    why: '좋은 질문의 4가지 공통점 — ① 범위가 좁다 (한국, 비전공자, 2024~2025년) ② 조사 대상이 명시되어 있다 (5곳) ③ 결과의 형태가 정해져 있다 (회사별 정리) ④ 검증 가능하다 (출처를 따라가서 확인 가능한 사실 위주).',
    tips: [
      '한국어 결과가 빈약하면 같은 질문을 영어로 한 번 더 던지세요',
      '약한 시장(신생/틈새)은 인접 시장으로 우회 — "코딩 교육 VOD" 대신 "한국 이러닝 시장 규모를 기반으로 코딩 교육 VOD의 잠재 규모를 추정할 단서를 모아줘"',
      '잘 통하는 시장: 통계청·KOSIS가 쌓인 분야, 상장사가 있어서 분기보고서가 공개되는 분야',
      '딥리서치 한 번에 소스 8~15개가 자동 추가됩니다 — 새로 들어온 소스를 하나하나 클릭해 자동 요약을 30초씩 훑어보세요',
    ],
    prompts: [
      { label: '시장 규모 조사', text: '한국에서 비전공자·직장인 대상 코딩 교육 VOD 플랫폼의 2024~2025년 시장 규모와 주요 사업자 5곳을 조사해줘. 각 사업자의 가격대, 커리큘럼 구성, 차별점을 정리하고 싶어.' },
      { label: '사용자 문제 조사', text: '한국 직장인이 코딩 독학 시 느끼는 진입 장벽과 중도 포기 원인에 관한 설문조사/기사/논문을 찾아줘. 가능하면 응답자 수와 발표 연도를 함께 볼 수 있었으면 좋겠어.' },
      { label: '경쟁사 상세 조사', text: '한국에서 운영 중인 코딩 교육 VOD 플랫폼 7곳의 공식 홈페이지/보도자료를 기반으로, 1) 가격 정책 2) 타겟 고객 3) 핵심 차별점 세 가지를 회사별로 정리할 수 있었으면 좋겠어.' },
    ],
  },

  /* ── 2. 크롬 확장 경쟁사 워크플로 ── */
  {
    icon: '🌐', title: '크롬 확장 경쟁사 워크플로',
    desc: '크롬 확장 "NotebookLM Web Importer"를 설치하면 웹 페이지를 한 클릭으로 소스에 추가할 수 있습니다. 경쟁사 5곳을 30분 만에 수집·분석하는 워크플로입니다.',
    type: 'chips',
    chips: ['메인 페이지', '가격/요금제', '회사 소개/팀', '보도자료/뉴스룸', '채용 공고'],
    why: '경쟁사당 위 5개 페이지를 수집하면 핵심 카피, 가격 구조, 창업 배경, 투자 단계, 현재 전략(채용=투자 방향)을 한 번에 파악할 수 있습니다. 5곳 × 5페이지 = 25개 소스(무료 한도 50개의 절반).',
    tips: [
      '확장 아이콘 우클릭 → "기본 노트북" 지정하면 이후 클릭 한 번으로 추가',
      '함정 1: 너무 많이 모은다 — 목적과 먼 자료는 과감하게 거르세요',
      '함정 2: 모으기만 하고 묻지 않는다 — "모으는 행동과 묻는 행동은 같은 세션 안에서 닫는다"',
      '자료가 잘 안 들어오면 Gemini에 캡처 이미지와 함께 "마크다운으로 정리해줘" 요청 후 텍스트 소스로 추가',
    ],
    prompts: [
      { label: '가격 비교표', text: '방금 추가한 5개 회사의 가격 정책을 회사/요금제/월 가격/차별 조항으로 표를 만들어줘. 출처는 회사명 옆에 인용 번호로 표시해줘.' },
      { label: '가치 제안 정리', text: '각 회사의 핵심 가치 제안(value proposition)을 한 줄씩 회사명과 함께 정리해줘.' },
      { label: '채용으로 전략 추론', text: '이 5개 회사의 채용 공고에서 가장 많이 등장하는 직무를 분류하고, 각 회사가 지금 어디에 투자하고 있는지 추론해줘.' },
      { label: '충돌 경쟁사 선별', text: '5개 회사 중에서 우리 아이템과 가장 강하게 충돌하는 회사 2곳을 골라주고, 그 이유를 출처와 함께 설명해줘.' },
    ],
  },

  /* ── 3. 자료 신뢰도 등급제 ── */
  {
    icon: '🏷️', title: '자료 신뢰도 등급제',
    desc: '모든 소스를 A/B/C 세 등급으로 분류합니다. A등급만 사업계획서에 직접 인용하고, C등급은 분위기 참고용으로만 사용합니다. 자료 30개가 쌓이면 "솎아내기 30분 루틴"을 돌립니다.',
    type: 'table',
    rows: [
      { grade: 'A', cls: 'wf-a', def: '1차 출처 / 공인기관', ex: '통계청, 정부 보고서, 상장사 분기보고서, 학술 논문', rule: '사업계획서에 그대로 인용 OK' },
      { grade: 'B', cls: 'wf-b', def: '2차 가공, 책임주체 분명', ex: '일간지, 전문지, 산업 리포트, 컨설팅펌', rule: '인용하되 A자료로 한 번 더 받침' },
      { grade: 'C', cls: 'wf-c', def: '출처 흐림 / 과도한 가공', ex: '익명 블로그, 위키피디아, 광고성 기사, 출처 없는 인포그래픽', rule: '인용하지 않음 (분위기 참고용)' },
    ],
    why: '솎아내기 30분 루틴: ① 10분 등급 묻기 → ② 10분 C등급 검수 (직접 클릭, "협찬/AD/PR" 확인, 진짜 C는 삭제) → ③ 10분 A등급 보강. 환각 위험 2가지 — 숫자의 단위·연도 혼동, 추정과 사실의 혼동.',
    tips: [
      '수집 즉시 등급을 매기세요 — 나중에 하면 잊어버립니다',
      'A등급이 3개 미만이면 딥리서치를 다시 돌리세요',
      'C등급도 아이디어 발굴에는 유용합니다 — 별도 노트북으로 이동',
      '자료 30개마다 + 이후 10개 추가될 때마다 솎아내기 루틴을 반복하세요',
    ],
    prompts: [
      { label: '등급 분류 요청', text: '이 노트북에 들어 있는 모든 소스를 다음 세 등급으로 분류해줘.\nA: 1차 출처 또는 공인 기관\nB: 2차 가공이지만 책임 주체가 분명한 매체\nC: 익명 블로그, 위키피디아, 광고성 기사\n등급 옆에 소스 제목과 등급을 매긴 이유를 한 줄씩 적어줘.' },
      { label: 'A등급 보강', text: '위 분류에서 A 등급이 부족한 주제를 알려줘. 그리고 그 주제에 대해 한국 통계청/정부 부처/상장사 분기보고서 중 어디를 찾아보면 좋을지 구체적인 출처 이름을 알려줘.' },
    ],
  },

  /* ── 4. 출처 있는 페르소나 ── */
  {
    icon: '👤', title: '출처 있는 페르소나',
    desc: '좋은 페르소나와 나쁜 페르소나의 차이는 출처 유무. NotebookLM의 인용 기능으로 속성마다 근거를 붙이고, 5단계 프롬프트로 체계적으로 구축합니다.',
    type: 'before-after',
    badLabel: '나쁜 페르소나',
    goodLabel: '좋은 페르소나',
    bad: '"박지훈, 29세, 마케터, 코딩을 배우고 싶다"',
    good: '"박지훈, 29세 (출처: 사람인 2025 직무전환 설문 p.8). 마케팅 직군에서 데이터 분석 역량을 키우고 싶어하는 비전공자 (출처: 인프런 수강생 인터뷰 영상 [4])"',
    why: '근거 없는 페르소나는 "만들어낸 사람"에 불과합니다. 인용이 있는 페르소나는 VC가 "이 고객이 진짜 있다"고 신뢰하는 근거가 됩니다. 주 페르소나 1명 + 보조 페르소나 1~2명이 적정합니다.',
    tips: [
      '연령/직업은 설문 데이터에서 인용하세요',
      '니즈/행동은 인터뷰나 리뷰 데이터를 활용하세요',
      '하나의 페르소나에 최소 3개 인용을 붙이세요',
      '함정: "이 페르소나의 근거가 된 소스 인용을 5개 보여줘"로 반드시 검증',
    ],
    prompts: [
      { label: 'Step 1: 인구통계', text: '"인터뷰" 소스를 근거로, 주요 사용자 1명의 인구통계 속성(나이, 성별, 직업, 거주 형태, 소득 구간)을 추정해줘.' },
      { label: 'Step 2: 하루 일과', text: '같은 사용자의 하루 일과를 시간대별로 표로 정리해줘. 퇴근 후 학습 시간대(19시~23시)는 30분 단위로 더 잘게 쪼개줘.' },
      { label: 'Step 3: 고민 5가지', text: '이 사용자가 코딩 독학과 관련해 느끼는 고민 5가지를 인용 근거와 함께 정리해줘.' },
      { label: 'Step 4: 해결책 비교', text: '이 사용자가 시도해본 해결책(유튜브, 유료 VOD, 부트캠프, 책, 스터디 모임)과 각 해결책에 대한 만족과 불만을 표로 정리해줘.' },
      { label: '고객 여정 지도', text: '주 페르소나가 우리 서비스를 만나는 전체 과정을 6단계(인지/고려/구매/첫 사용/반복 사용/이탈 또는 추천)로 고객 여정 지도를 만들어줘. 각 단계마다 행동, 머릿속 생각, 감정, 접점(채널/도구)을 적어줘.' },
    ],
  },

  /* ── 5. 다각도 페르소나 검증 ── */
  {
    icon: '🎭', title: '다각도 페르소나 검증',
    desc: '같은 가설을 VC, 고객, 멘토 세 시야에서 검증합니다. NotebookLM은 10,000자까지 페르소나 지시문을 작성할 수 있어 정밀한 역할 부여가 가능합니다.',
    type: 'personas',
    personas: [
      { label: 'VC: 숫자와 시장 위험 — 시장 규모, 단위경제, 경쟁 위험, 확장성', cls: 'vc' },
      { label: '고객: 결정의 순간 — 가격, 학습 효과, 일상 안에서의 자리', cls: 'customer' },
      { label: '멘토: 다음 한 발의 방향 — 우선순위, 실행 순서, 리스크 관리', cls: 'mentor' },
    ],
    why: '창업자는 자기 아이디어에 빠지기 쉽습니다. 고객 페르소나의 차가운 답변 예시: "이미 인프런이 있는데 왜 또 새로운 플랫폼이죠", "월 구독이면 안 듣는 달에도 돈이 나가잖아요". 한 페르소나당 10분 안팎이 적당합니다.',
    tips: [
      '페르소나가 작가 편을 들면 → "칭찬은 빼고, 자료의 사실과 너의 입장만 말해줘"',
      'Audio Overview로 VC 두 명의 투자 토론을 만들어 들어보세요 — 말을 멈추거나 화제를 바꾸는 자리가 가장 먼저 고쳐야 할 곳',
      '셋의 답이 충돌하는 자리는 작가가 결정해야 하는 자리입니다',
    ],
    prompts: [
      { label: 'VC 페르소나 설정', text: '이제부터 너는 시드 단계 스타트업에 5년 동안 30회 이상 투자한 한국 VC다. 톤은 정중하지만 단정적이다. 노트북 안의 자료만 근거로 답하되, 자료에 없는 것은 "그 부분은 자료에 없습니다. 다음 미팅 전까지 가져오시면 좋겠습니다"라고 적는다.' },
      { label: '고객 페르소나 설정', text: '이제부터 너는 노트북 안의 [페르소나 카드 1번에 적힌 인물]이다. 직업, 나이, 하루 일과, 학습 습관까지 그 카드 안의 내용에 충실해라. 너는 작가가 만드는 서비스를 모른다. 칭찬은 하지 말고, 가격과 학습 효과와 너의 일상 안에서의 자리만 본다.' },
      { label: 'Audio Overview 토론', text: '너희 둘은 시드 단계 VC 두 명이다. 노트북 안의 자료를 방금 읽었다. 이 사업의 투자 가능성을 두고 솔직한 대화를 나눠라. 약한 자리를 짚고, 마지막에 다음 미팅을 잡을지 결론 내려라.' },
    ],
  },

  /* ── 6. TAM·SAM·SOM 산정 ── */
  {
    icon: '📐', title: 'TAM·SAM·SOM 산정',
    desc: '톱다운(전체→부분)과 보텀업(단가×인원)을 동시에 계산하여 시장 규모를 추정합니다. 두 방향에서 비슷하게 나오면 신뢰도가 올라갑니다.',
    type: 'before-after',
    badLabel: '약한 접근',
    goodLabel: '강한 접근',
    bad: '톱다운만 한 번 계산하고 끝. 위키피디아 한 줄을 통계청 인용처럼 씀. 단위 혼재("조"와 "억", "월"과 "년").',
    good: '톱다운 4단계(전체시장→분야비중→형태비중→SAM) + 보텀업(월결제×추정사용자) 동시 산출. SOM은 SAM의 1~5% 범위로 보수적 설정.',
    why: 'TAM=이론적 전체 시장, SAM=우리 모델이 닿을 수 있는 부분, SOM=1~3년 안에 실제로 가져갈 부분. SOM이 SAM의 1% 미만이면 보수적이지만 신뢰감, 5% 초과면 "어떻게 그렇게 빨리?"에 대한 설명 준비가 필요합니다.',
    tips: [
      '톱다운: 통계청 KOSIS, 공공데이터포털(data.go.kr) 활용 — 출처만 표기하면 자유 활용',
      '보텀업: 사용자 1명의 월 결제 금액 × 추정 도달 인원 × 전환율로 계산',
      '"조"와 "억", "월"과 "년" 단위가 섞이지 않도록 주의하세요',
    ],
    prompts: [
      { label: '톱다운 Step 1', text: '"산업실태" 소스를 기반으로 한국의 이러닝 시장 전체 규모(연간, 원)를 가장 최근 수치로 알려줘. 출처와 발표 연도를 같이 표시해줘.' },
      { label: '톱다운 Step 2~3', text: '이 중 코딩/IT 분야 교육이 차지하는 비중을 추정하고, VOD 강의 형태로 옮겨갈 가능성이 있는 비중을 추정해줘. 근거 자료와 가정 3가지를 적어줘.' },
      { label: 'SAM 계산', text: '위 세 숫자를 기반으로 우리 서비스의 SAM을 계산해줘. 곱셈 과정과 단위까지 포함해 한 줄로 보여줘.' },
      { label: 'SOM 계산', text: '다음 세 가정 — [채널], [도달 인원], [전환율] — 을 사용해 1년차 SOM을 계산해줘. 곱셈식과 단위를 같이 보여주고, 이 SOM이 SAM의 몇 퍼센트인지 비율도 알려줘.' },
    ],
  },

  /* ── 7. 사업계획서 7절 구조 ── */
  {
    icon: '📊', title: '사업계획서 7절 구조',
    desc: '어느 양식을 받든 사업계획서는 7가지 질문으로 압축됩니다. NotebookLM이 모은 부품(인터뷰, 경쟁사표, BMC, 단위경제)으로 각 절을 채웁니다.',
    type: 'chips',
    chips: ['1. 문제', '2. 해결', '3. 시장', '4. BM', '5. 실행', '6. 팀', '7. 재무'],
    why: '평가위원이 묻는 7가지: ① 누구의 어떤 불편을 푸는가 ② 어떻게 푸는가 ③ 시장은 얼마나 크고 누가 있는가 ④ 어떻게 돈을 버는가 ⑤ 1년 안에 무엇을 할 것인가 ⑥ 왜 너희가 해내는가 ⑦ 돈이 얼마 들고 언제 회수되는가.',
    tips: [
      '각 절마다 NotebookLM에서 해당 소스만 체크하고 질문하세요',
      '3절(시장)은 A등급 소스만 인용하세요',
      '초안 받은 뒤 3가지 점검: 단락 순서 자연스러운가 / 창업가만 아는 한 줄이 있는가 / 약한 단락이 있는가',
      '완성된 사업계획서를 Google Docs 링크로 다시 소스에 추가 → IR Deck 작성 시 참조',
    ],
    prompts: [
      { label: '초안 작성', text: '대화했던 내용과 소스를 기반으로 사업계획서 초안을 작성해줘.\n1. 문제 2. 해결 3. 시장 4. BM 5. 실행 계획 6. 팀 7. 재무\n근거가 되는 자료가 없을 경우 "출처 보강 필요"라고 표시해줘.\n우리 아이템은 [아이템 설명]이야.' },
      { label: 'Gemini로 다듬기', text: '이 문서는 [아이템] 사업계획서 초안이야. 평가위원 관점에서 검토하고 수정안을 제시해줘.\n1. 논리 연결: 문제→해결→시장→BM 흐름이 끊기는 지점\n2. 숫자 검증: 근거 없이 단정한 수치나 "출처 보강 필요"로 남은 곳\n3. 중복 표현: 같은 말을 다른 절에서 반복하는 부분\n4. 약한 문장: 구체성이 떨어져 인상에 남지 않는 문장\n수정 제안은 원문 → 제안 형식으로 나란히 보여주고, 왜 그렇게 바꾸는지 한 줄 이유를 덧붙여줘.' },
    ],
  },

  /* ── 8. IR Deck 10슬라이드 ── */
  {
    icon: '🎬', title: 'IR Deck 10슬라이드',
    desc: '사업계획서는 "읽는 문서", IR Deck은 "보는 문서". 한 슬라이드 한 메시지 원칙 — 헤드라인 15자 이내 + 본문 두 줄 + 근거 숫자 한 개. 총 100자 안쪽.',
    type: 'chips',
    chips: ['1.커버', '2.문제', '3.해결', '4.제품', '5.시장', '6.경쟁', '7.BM', '8.성장', '9.팀', '10.요청'],
    why: '한 슬라이드에 메시지가 두 개 이상이면 투자자의 집중력이 분산됩니다. 2번 문제와 7번 BM은 같은 사용자 언어로 이어져야 합니다. 커버는 마지막에 작성하세요.',
    tips: [
      '헤드라인 예시: "강의 3개 결제, 완강 0개" (문제), "CAC 1.5만, LTV 24만" (BM)',
      'Google Slides로 내보내면 바로 편집 가능합니다',
      '"슬라이드 간 연결이 끊긴 자리"를 AI에게 짚어달라고 요청하세요',
      '커버 태그라인 후보 3개를 각각 한 줄 이유와 함께 받으세요',
    ],
    prompts: [
      { label: 'IR Deck 생성', text: '노트북 안의 사업계획서 초안, BMC, 단위경제, 경쟁사 표, 인터뷰 자료를 근거로 IR Deck 10슬라이드를 한 번에 만들고 아래 형식으로 표로도 작성해줘.\n| # | 슬라이드 | 헤드라인(15자 이내) | 본문(두 줄 이내) | 근거 숫자 한 개 | 인용 [숫자] |\n\n작성 규칙:\n- 한 슬라이드 한 메시지. 총 글자 수 100자 안쪽.\n- 숫자/인용은 반드시 노트북 안의 소스에서만 가져오고, [숫자] 인용 번호를 붙여줘.\n- 2번 문제와 7번 BM은 같은 사용자 언어로 이어지게 써줘.\n- 1번 커버는 마지막에 쓰고, 태그라인 후보 세 개를 각각 한 줄 이유와 함께 줘.\n- 표 아래에 "슬라이드 간 연결이 끊긴 자리"를 세 줄 이내로 짚어줘.' },
    ],
  },
];

const navSections = [
  { id: 'overview', label: '기법 개요' },
  { id: 'deep-research', label: '딥리서치 질문 설계' },
  { id: 'chrome-ext', label: '크롬 확장 워크플로' },
  { id: 'trust-grade', label: '자료 신뢰도 등급제' },
  { id: 'persona', label: '출처 있는 페르소나' },
  { id: 'persona-verify', label: '다각도 검증' },
  { id: 'tam-sam-som', label: 'TAM·SAM·SOM' },
  { id: 'biz-plan', label: '사업계획서 7절' },
  { id: 'ir-deck', label: 'IR Deck 10슬라이드' },
  { id: 'summary', label: '요약 & 난이도' },
];

const sectionIds = ['overview', 'deep-research', 'chrome-ext', 'trust-grade', 'persona', 'persona-verify', 'tam-sam-som', 'biz-plan', 'ir-deck', 'summary'];

/* ─── Component ─── */

const Techniques = (): ReactElement => {
  const [activeSection, setActiveSection] = useState('overview');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const setSectionRef = useCallback((id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
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

  const renderCard = (w: WorkflowCard) => (
    <>
      <p className="content-section-desc">{w.desc}</p>

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
            <span>등급</span><span>정의</span><span>예시</span><span>사용 규칙</span>
          </div>
          {w.rows.map((r, j) => (
            <div className={`wf-row ${r.cls}`} key={j}>
              <span>{r.grade}</span><span>{r.def}</span><span>{r.ex}</span><span>{r.rule}</span>
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

      {w.prompts && w.prompts.length > 0 && (
        <div className="technique-prompts">
          <strong className="technique-prompts-title">복사해서 바로 쓰는 프롬프트</strong>
          {w.prompts.map((p, j) => (
            <div className="technique-prompt-block" key={j}>
              <span className="technique-prompt-label">{p.label}</span>
              <p className="technique-prompt-text">{p.text}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      <SEOHead title="교육 핵심 기법" description="DreamIT Biz 교육 과정에서 배우는 NotebookLM 8가지 실전 기법. 딥리서치, 신뢰도 등급, 페르소나 검증, TAM·SAM·SOM, 사업계획서, IR Deck." path="/techniques" />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">KEY TECHNIQUES</span>
          <h1 className="page-title">교육 핵심 기법</h1>
          <p className="page-description">DreamIT Biz 교육 과정에서 배우는 NotebookLM 실전 기법 — 실제 프롬프트 포함</p>
        </div>
      </section>

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
              {/* 기법 개요 */}
              <div id="overview" ref={setSectionRef('overview')} className="content-section">
                <span className="content-section-badge">OVERVIEW</span>
                <h2 className="content-section-title">왜 기법이 중요한가?</h2>
                <p className="content-section-desc">
                  NotebookLM은 도구일 뿐, <strong>좋은 결과를 만드는 것은 기법</strong>입니다. 같은 도구를 사용해도 질문 설계, 자료 분류, 검증 방법에 따라 결과물의 품질이 크게 달라집니다.
                </p>
                <p className="content-section-desc">
                  아래 8가지 기법은 <em>NotebookLM 에센셜</em> 교재의 실전 워크플로를 압축한 것입니다. 각 기법마다 <strong>복사해서 바로 쓸 수 있는 프롬프트</strong>를 포함하고 있습니다.
                </p>
              </div>

              {/* 8가지 기법 — 각각 독립 섹션 */}
              {workflowCards.map((w, i) => (
                <div id={sectionIds[i + 1]} key={i} ref={setSectionRef(sectionIds[i + 1])} className="content-section">
                  <span className="content-section-badge">{`기법 ${i + 1}`}</span>
                  <h2 className="content-section-title">
                    <span style={{ marginRight: '8px' }}>{w.icon}</span>{w.title}
                  </h2>
                  {renderCard(w)}
                </div>
              ))}

              {/* 요약 & 난이도 */}
              <div id="summary" ref={setSectionRef('summary')} className="content-section">
                <span className="content-section-badge">SUMMARY</span>
                <h2 className="content-section-title">기법 요약 & 난이도</h2>
                <p className="content-section-desc">각 기법의 난이도와 관련 챕터를 확인하세요</p>
                <div className="comparison-table">
                  <div className="comp-row comp-header">
                    <span>기법</span>
                    <span>난이도</span>
                    <span>관련 챕터</span>
                  </div>
                  {[
                    { name: '딥리서치 질문 설계', diff: 'easy', diffLabel: '초급', ch: 'ch2', chLabel: 'CH.2' },
                    { name: '크롬 확장 경쟁사 워크플로', diff: 'easy', diffLabel: '초급', ch: 'ch2', chLabel: 'CH.2' },
                    { name: '자료 신뢰도 등급제', diff: 'easy', diffLabel: '초급', ch: 'ch2', chLabel: 'CH.2' },
                    { name: '출처 있는 페르소나', diff: 'medium', diffLabel: '중급', ch: 'ch3', chLabel: 'CH.3' },
                    { name: '다각도 페르소나 검증', diff: 'medium', diffLabel: '중급', ch: 'ch4', chLabel: 'CH.4' },
                    { name: 'TAM·SAM·SOM 산정', diff: 'medium', diffLabel: '중급', ch: 'ch3', chLabel: 'CH.3' },
                    { name: '사업계획서 7절 구조', diff: 'hard', diffLabel: '고급', ch: 'ch6', chLabel: 'CH.6' },
                    { name: 'IR Deck 10슬라이드', diff: 'hard', diffLabel: '고급', ch: 'ch6', chLabel: 'CH.6' },
                  ].map((row, i) => (
                    <div className={`comp-row${i % 2 === 0 ? ' comp-even' : ''}`} key={i}>
                      <span>{row.name}</span>
                      <span><span className={`difficulty-badge ${row.diff}`}>{row.diffLabel}</span></span>
                      <span><Link to={`/curriculum/${row.ch}`}>{row.chLabel}</Link></span>
                    </div>
                  ))}
                </div>

                <div className="cta-actions" style={{ marginTop: '32px', justifyContent: 'flex-start' }}>
                  <Link to="/consulting" className="btn btn-primary">교육 문의하기</Link>
                  <Link to="/curriculum" className="btn btn-outline">커리큘럼 보기</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Techniques;
