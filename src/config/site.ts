import type { SiteConfig } from '../types';

const site: SiteConfig = {
  id: 'notebooklm',
  name: 'NotebookLM Learning Center',
  nameKo: 'NotebookLM 학습 센터',
  description: '드림아이티비즈가 제공하는 Google NotebookLM 교육 과정. 기초부터 사업계획서 작성까지 체계적으로 배우세요.',
  url: 'https://notebooklm.dreamitbiz.com',
  dbPrefix: 'nlm_',

  parentSite: {
    name: 'DreamIT Biz',
    url: 'https://www.dreamitbiz.com'
  },

  brand: {
    parts: [
      { text: 'Dream', className: 'brand-dream' },
      { text: 'IT', className: 'brand-it' },
      { text: 'NotebookLM', className: 'brand-biz' }
    ]
  },

  themeColor: '#0046C8',

  company: {
    name: '드림아이티비즈(DreamIT Biz)',
    ceo: '이애본',
    bizNumber: '601-45-20154',
    salesNumber: '제2024-수원팔달-0584호',
    publisherNumber: '제2026-000026호',
    address: '경기도 수원시 팔달구 매산로 45, 419호',
    email: 'aebon@dreamitbiz.com',
    phone: '010-3700-0629',
    kakao: 'aebon',
    businessHours: '평일: 09:00 ~ 18:00',
  },

  features: {
    shop: false,
    community: false,
    search: false,
    auth: true,
    license: false,
  },

  colors: [
    { name: 'blue', color: '#0046C8' },
    { name: 'red', color: '#C8102E' },
    { name: 'green', color: '#00855A' },
    { name: 'purple', color: '#8B1AC8' },
    { name: 'orange', color: '#C87200' },
  ],

  menuItems: [
    { path: '/about', labelKey: 'site.nav.about' },
    { path: '/features', labelKey: 'site.nav.features' },
    { path: '/curriculum', labelKey: 'site.nav.curriculum' },
    { path: '/techniques', labelKey: 'site.nav.workflow' },
    { path: '/consulting', labelKey: 'site.nav.consulting' },
    { path: '/consulting#faq', labelKey: 'site.nav.faq' },
  ],

  footerLinks: [
    { path: '/', labelKey: 'nav.home' },
    { path: '/about', labelKey: 'site.nav.about' },
    { path: '/curriculum', labelKey: 'site.nav.curriculum' },
    { path: '/consulting', labelKey: 'site.nav.consulting' },
    { path: '/consulting#faq', labelKey: 'site.nav.faq' },
  ],

  familySites: [
    { name: 'DreamIT Biz (본사이트)', url: 'https://www.dreamitbiz.com' },
    { name: 'AHP 연구 플랫폼', url: 'https://ahp-basic.dreamitbiz.com' },
    { name: '핵심역량 자가측정', url: 'https://competency.dreamitbiz.com' },
  ]
};

export default site;
