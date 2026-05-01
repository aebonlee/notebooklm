# NotebookLM Learning Center

DreamIT Biz가 제공하는 Google NotebookLM 교육 과정 사이트.
기초부터 사업계획서 작성까지 체계적으로 배울 수 있는 7개 챕터 커리큘럼을 안내합니다.

- **URL**: https://notebooklm.dreamitbiz.com
- **Tech Stack**: React 19 + Vite + TypeScript
- **Backend**: Supabase (DB prefix: `nlm_`)
- **Deploy**: GitHub Pages (`npx gh-pages -d dist`)

## Setup

```bash
cp .env.example .env    # Supabase 키 설정
npm install
npm run dev             # 개발 서버
npm run build           # 빌드
npm run deploy          # GitHub Pages 배포
```

## Structure

```
src/
  config/site.ts        # 사이트 설정 (id, dbPrefix, menu, features)
  pages/Home.tsx        # 메인 랜딩 페이지 (10개 섹션)
  styles/site.css       # NotebookLM 전용 스타일 + 다크모드
  utils/translations.ts # 한/영 번역
```

## Copyright

(c) 2025-2026 DreamIT Biz (Ph.D Aebon Lee). All Rights Reserved.
