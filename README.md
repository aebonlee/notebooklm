# NotebookLM Learning Center

> Google NotebookLM 실전 교육 과정 — 기초부터 사업계획서까지 7개 챕터

**URL**: https://notebooklm.dreamitbiz.com

---

## 개요

NotebookLM 학습 센터는 Google NotebookLM을 활용한 실전 교육 과정을 제공하는 사이트입니다. 딥리서치, 자료 신뢰도 등급제, 출처 있는 페르소나, 사업계획서 7절 구조, IR Deck 10슬라이드까지 6가지 핵심 기법을 체계적으로 학습할 수 있습니다.

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프론트엔드 | React 19 + TypeScript 5.8 |
| 빌드 | Vite 7.x |
| 백엔드 | Supabase (Auth + DB + Edge Functions) |
| 결제 | PortOne Browser SDK |
| 배포 | GitHub Pages (gh-pages) |
| 테마 | 다크/라이트 자동 + 5색 컬러 테마 |
| 다국어 | 한국어 / 영어 |

---

## 페이지 구조 (31개)

### 공개 페이지
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | Home | 8개 섹션 랜딩 페이지 |
| `/about` | About | NotebookLM 핵심 개념, 차별점, 비교표 |
| `/features` | Features | Studio 6가지 기능 상세 |
| `/guide` | Guide | 시작 가��드 (4단계 + 팁) |
| `/curriculum` | Curriculum | 7개 챕터 개요 (사이드바) |
| `/curriculum/ch1~ch7` | Chapter | 챕터별 상세 페이지 |
| `/techniques` | Techniques | 6가지 핵심 기��� |
| `/use-cases` | UseCases | 비즈니스/연구/교육 활용사례 |
| `/consulting` | Consulting | 교육 프로그램 4종 + FAQ |
| `/resources` | Resources | 자료실 |

### 커뮤니티
- `/community/board` — 자유게시판
- `/community/board/:id` — 게시글 상세
- `/community/board/write` — 글쓰기
- `/community/gallery` — 갤러리

### 인증 / 상점
- `/login`, `/register`, `/forgot-password`, `/mypage`
- `/cart`, `/checkout`, `/order-history`, `/order-confirmation`

### 관리자
- `/admin` — 관리자 대시보드 (회원/주문/게시판/자료 관리)

---

## 사이드바 내비게이션 (5개 페이지)

| 페이지 | 섹션 수 | CSS 클래스 |
|--------|---------|-----------|
| Curriculum | 9 | `curriculum-sidebar-layout` |
| About | 6 | `page-sidebar-layout` |
| Guide | 4 | `page-sidebar-layout` |
| Techniques | 8 | `page-sidebar-layout` |
| UseCases | 4 | `page-sidebar-layout` |

- IntersectionObserver 기반 활성 섹션 자동 추적
- 768px 이하: 수평 칩 메뉴로 전환

---

## 디렉토리 구조

```
src/
├── components/       # 공유 컴포넌트
├── config/site.ts    # 사이트 설정 (메뉴, 기능 플래그)
├── contexts/         # AuthContext
├── data/chapters.ts  # 7개 챕터 데이터
├── layouts/          # PublicLayout (라우팅)
├── pages/
│   ├── admin/        # AdminDashboard
│   ├── community/    # Board, BoardDetail, BoardWrite, Gallery
│   ├── curriculum/   # ChapterPage, Chapter1~7
│   └── *.tsx         # 메인 페이지들
├── styles/
│   ├── site.css      # 사이트 전용 스타일
│   ├── dark-mode.css # 다크모드
│   └── admin.css     # 관리자 스타일
├── types/            # TypeScript 타입
└── utils/            # Supabase, Storage, Notifications
```

---

## 개발 명령어

```bash
npm run dev           # 개발 서버
npm run build         # TypeScript 체크 + Vite 빌드
npm run deploy        # GitHub Pages 배포
npm run og-image      # OG 이미지 생성
```

---

## Supabase 설정

- **프로젝트**: `hcmgdztsgjvzcyxyayaj.supabase.co`
- **테이블 prefix**: `nlm_`
- **테이블**: `nlm_board_posts`, `nlm_gallery_items`, `nlm_resources`

---

## 테마 색상 (Google Blue)

| 요소 | 라이트 | 다크 |
|------|--------|------|
| Primary | `#4285f4` | `#6ba3f7` |
| Hero BG | `#2d5baa → #1a3366` | `#1a3366 → #112244` |
| Gradient | `#4285f4 → #7baaf7` | `#3367d6 → #6ba3f7` |

---

## 개발 이력

| 날짜 | 작업 |
|------|------|
| 2026-05-06 | 4개 페이지 사이드바 메뉴 추가, UTF-8 수정, activePath 수정 |
| 2026-05-05 | 전면 개편 (20+ 페이지), 컬러 통일, 콘텐츠 정리, Curriculum 사이드바 |
| 2026-05-04 | templete-ref 기반 React + Vite + TypeScript 전환 |

---

## Copyright

(c) 2025-2026 DreamIT Biz (Ph.D Aebon Lee). All Rights Reserved.
