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
      { text: 'NotebookLM', className: 'brand-biz' }
    ]
  },

  themeColor: '#4285f4',

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
    shop: true,
    community: true,
    search: true,
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
    {
      path: '#',
      activePath: '/about',
      labelKey: 'site.nav.intro',
      dropdown: [
        { path: '/about', labelKey: 'site.nav.about' },
        { path: '/features', labelKey: 'site.nav.features' },
        { path: '/guide', labelKey: 'site.nav.guide' },
      ]
    },
    {
      path: '#',
      activePath: '/curriculum',
      labelKey: 'site.nav.curriculum',
      dropdown: [
        { path: '/curriculum', labelKey: 'site.nav.curriculumOverview' },
        { path: '/curriculum/ch1', labelKey: 'site.nav.ch1' },
        { path: '/curriculum/ch2', labelKey: 'site.nav.ch2' },
        { path: '/curriculum/ch3', labelKey: 'site.nav.ch3' },
        { path: '/curriculum/ch4', labelKey: 'site.nav.ch4' },
        { path: '/curriculum/ch5', labelKey: 'site.nav.ch5' },
        { path: '/curriculum/ch6', labelKey: 'site.nav.ch6' },
        { path: '/curriculum/ch7', labelKey: 'site.nav.ch7' },
      ]
    },
    {
      path: '#',
      activePath: '/techniques',
      labelKey: 'site.nav.learningContent',
      dropdown: [
        { path: '/techniques', labelKey: 'site.nav.workflow' },
        { path: '/use-cases', labelKey: 'site.nav.useCases' },
      ]
    },
    {
      path: '#',
      activePath: '/resources',
      labelKey: 'site.nav.support',
      dropdown: [
        { path: '/resources', labelKey: 'site.nav.resources' },
        { path: '/consulting', labelKey: 'site.nav.consulting' },
        { path: '/consulting#faq', labelKey: 'site.nav.faq' },
      ]
    },
    {
      path: '#',
      activePath: '/community',
      labelKey: 'site.nav.community',
      dropdown: [
        { path: '/community/board', labelKey: 'site.nav.board' },
        { path: '/community/gallery', labelKey: 'site.nav.gallery' },
      ]
    },
  ],

  footerLinks: [
    { path: '/', labelKey: 'nav.home' },
    { path: '/about', labelKey: 'site.nav.about' },
    { path: '/curriculum', labelKey: 'site.nav.curriculum' },
    { path: '/techniques', labelKey: 'site.nav.workflow' },
    { path: '/use-cases', labelKey: 'site.nav.useCases' },
    { path: '/consulting', labelKey: 'site.nav.consulting' },
    { path: '/community/board', labelKey: 'site.nav.board' },
    { path: '/resources', labelKey: 'site.nav.resources' },
  ],

  familySites: [
    { name: 'DreamIT Biz (본사이트)', url: 'https://www.dreamitbiz.com' },
    { name: 'AHP 연구 플랫폼', url: 'https://ahp-basic.dreamitbiz.com' },
    { name: '핵심역량 자가측정', url: 'https://competency.dreamitbiz.com' },
  ]
};

export default site;
