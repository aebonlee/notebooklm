export interface ChapterData {
  ch: string;
  num: number;
  title: string;
  tag: string;
  desc: string;
  topics: string[];
  learningGoals: string[];
  keyActivities: string[];
  deliverables: string[];
  tools: string[];
  duration: string;
}

export const chapters: ChapterData[] = [
  {
    ch: 'CH.1', num: 1, title: 'NotebookLM 30분 기본기', tag: '입문', duration: '2시간',
    desc: '인터페이스 세 칸(소스 / 채팅 / Studio)의 관계를 이해하고, 왜 NotebookLM이 다른 챗봇과 다른지 체감합니다.',
    topics: ['소스 → 채팅 → Studio 흐름', '근거자료 기반 답변의 차이', '페르소나 설정 (10,000자)', 'Gemini 연동 활용'],
    learningGoals: ['NotebookLM의 3칸 인터페이스 구조를 설명할 수 있다', '범용 챗봇과의 핵심 차이점 3가지를 비교할 수 있다', '첫 번째 노트북을 만들고 소스를 업로드할 수 있다'],
    keyActivities: ['노트북 생성 및 첫 소스 업로드 실습', '같은 질문을 ChatGPT와 NotebookLM에서 비교', '페르소나 설정 실습 (10,000자 지시문 작성)'],
    deliverables: ['첫 번째 노트북 (소스 3개 이상)', '페르소나 설정 문서'],
    tools: ['NotebookLM', 'Google Docs'],
  },
  {
    ch: 'CH.2', num: 2, title: '시장 자료 모으기', tag: '자료 수집', duration: '3시간',
    desc: '딥리서치, 크롬 확장, 유튜브를 활용해 노트북에 자료를 체계적으로 수집하고 신뢰도를 검증합니다.',
    topics: ['딥리서치로 자료 자동 수집', '크롬 확장으로 경쟁사 분석', '유튜브 영상 시장 분석', 'A/B/C 등급 신뢰도 검증', '못 읽히는 자료 우회법'],
    learningGoals: ['딥리서치와 패스트리서치의 용도를 구분할 수 있다', '소스의 신뢰도를 A/B/C 등급으로 분류할 수 있다', '못 읽히는 자료를 우회하는 3가지 방법을 적용할 수 있다'],
    keyActivities: ['딥리서치로 경쟁사 자료 10개 수집', '크롬 확장 프로그램 설치 및 웹페이지 캡처', '유튜브 영상 URL 소스 추가 실습', '수집한 자료 A/B/C 등급 분류'],
    deliverables: ['시장 자료 노트북 (소스 15개 이상)', '소스 신뢰도 등급표'],
    tools: ['NotebookLM 딥리서치', 'Chrome 확장', 'YouTube'],
  },
  {
    ch: 'CH.3', num: 3, title: '사용자와 시장 정의', tag: '시장 분석', duration: '3시간',
    desc: '디자인 씽킹으로 페르소나를 만들고, TAM/SAM/SOM을 산정하며, SWOT을 분석합니다.',
    topics: ['디자인 씽킹 5단계 활용', '출처 있는 페르소나 구축', '고객 여정 지도(CJM)', 'TAM · SAM · SOM 산정', '경쟁사 비교 & SWOT'],
    learningGoals: ['출처가 있는 페르소나를 작성할 수 있다', 'TAM/SAM/SOM을 인용 근거와 함께 산정할 수 있다', '경쟁사 비교표와 SWOT 분석표를 작성할 수 있다'],
    keyActivities: ['디자인 씽킹 5단계를 NotebookLM으로 실습', '인용 번호가 붙은 페르소나 프로필 작성', '시장 규모 3단계(TAM→SAM→SOM) 산정', '경쟁사 5곳 비교표 작성'],
    deliverables: ['페르소나 프로필 (출처 포함)', '시장 규모 산정 시트', 'SWOT 분석표'],
    tools: ['NotebookLM', 'Google Sheets', 'Google Slides'],
  },
  {
    ch: 'CH.4', num: 4, title: '소스 선별 & 페르소나 검증', tag: '검증', duration: '2시간',
    desc: '핵심 소스만 골라서 채팅하고, VC/고객/멘토 시야로 다각도 검증합니다.',
    topics: ['소스 체크박스 선별 채팅', '핵심 소스 4가지 기준', 'VC · 고객 · 멘토 페르소나', 'Audio Overview 피드백'],
    learningGoals: ['핵심 소스 4가지 선별 기준을 적용할 수 있다', 'VC/고객/멘토 3가지 관점에서 가설을 검증할 수 있다', 'Audio Overview를 활용해 팀 피드백을 수집할 수 있다'],
    keyActivities: ['50개 소스에서 핵심 10개 선별 실습', 'VC 페르소나로 투자 적합성 검증', '고객 페르소나로 가격/기능 검증', 'Audio Overview로 팟캐스트 생성 및 공유'],
    deliverables: ['핵심 소스 선별 목록', '3가지 페르소나 검증 보고서', 'Audio Overview 피드백 팟캐스트'],
    tools: ['NotebookLM', 'Audio Overview'],
  },
  {
    ch: 'CH.5', num: 5, title: 'BM과 분석 자료 만들기', tag: '비즈니스', duration: '3시간',
    desc: '데이터 표를 구글 시트로 연동하고, BM 캔버스 9칸과 단위경제를 작성합니다.',
    topics: ['표 만들기 5칸 프롬프트', '구글 시트 연동', 'BM 캔버스 9칸', 'CAC / ARPU / LTV 시트'],
    learningGoals: ['5칸 프롬프트로 정확한 데이터 표를 생성할 수 있다', 'BM 캔버스 9칸을 인용 근거와 함께 완성할 수 있다', '단위경제(CAC/ARPU/LTV) 시트를 작성할 수 있다'],
    keyActivities: ['5칸 프롬프트로 경쟁사 가격 비교표 생성', '구글 시트로 데이터 내보내기', 'BM 캔버스 9칸 채우기', 'CAC/ARPU/LTV 계산 시트 작성'],
    deliverables: ['경쟁사 비교 데이터 시트', 'BM 캔버스 9칸 완성본', '단위경제 계산 시트'],
    tools: ['NotebookLM', 'Google Sheets'],
  },
  {
    ch: 'CH.6', num: 6, title: '사업계획서 & IR Deck', tag: '산출물', duration: '3시간',
    desc: '사업계획서 7절을 한 통의 프롬프트로 초안 작성하고, IR Deck 10슬라이드를 완성합니다.',
    topics: ['사업계획서 7절 구조', 'Gemini로 다듬기', 'IR Deck 10슬라이드', '한 슬라이드 한 메시지'],
    learningGoals: ['사업계획서 7절 구조를 이해하고 초안을 작성할 수 있다', 'Gemini와 NotebookLM을 분업하여 문서를 다듬을 수 있다', 'IR Deck 10슬라이드를 완성할 수 있다'],
    keyActivities: ['7절 구조 프롬프트로 사업계획서 초안 생성', 'Gemini로 문체/표현 다듬기', 'IR Deck 10슬라이드 구성', '한 슬라이드 한 메시지 원칙 적용'],
    deliverables: ['사업계획서 7절 초안', 'IR Deck 10슬라이드 (Google Slides)'],
    tools: ['NotebookLM', 'Gemini', 'Google Slides'],
  },
  {
    ch: 'CH.7', num: 7, title: '부록: 실전 활용 & 워크숍', tag: '부록', duration: '2시간',
    desc: 'Google Flow로 30초 애니메이션 제작, 수업 현장 활용법, 회사 스타일 발표 자료 만들기 등 실전 노하우를 다룹니다.',
    topics: ['Google Flow 애니메이션 제작', '수업 현장 활용 가이드 (4h~16h)', '회사 스타일 발표 자료 만들기'],
    learningGoals: ['Google Flow로 30초 애니메이션을 제작할 수 있다', '4h/8h/16h 수업 시간에 맞춰 커리큘럼을 조정할 수 있다', '회사 CI에 맞는 발표 자료 템플릿을 만들 수 있다'],
    keyActivities: ['Google Flow 애니메이션 제작 실습', '수업 시간별 커리큘럼 설계', '회사 템플릿 적용 발표 자료 제작'],
    deliverables: ['Google Flow 애니메이션 1개', '수업 운영 가이드', '회사 스타일 발표 자료'],
    tools: ['Google Flow', 'NotebookLM', 'Google Slides'],
  },
];
