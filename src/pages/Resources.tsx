import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { useAuth } from '../contexts/AuthContext';
import { getResources } from '../utils/resourceStorage';
import type { Resource } from '../utils/resourceStorage';
import type { ReactElement } from 'react';

const categories = [
  { value: 'all', label: '전체' },
  { value: 'pdf', label: 'PDF' },
  { value: 'template', label: '템플릿' },
  { value: 'video', label: '영상' },
  { value: 'link', label: '링크' },
];

const categoryIcons: Record<string, string> = {
  pdf: '📄',
  template: '📋',
  video: '🎬',
  link: '🔗',
};

const Resources = (): ReactElement => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
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
  }, [resources]);

  useEffect(() => {
    loadResources();
  }, [activeCategory]);

  const loadResources = async () => {
    setLoading(true);
    const data = await getResources(activeCategory);
    setResources(data);
    setLoading(false);
  };

  return (
    <>
      <SEOHead title="자료���" description="NotebookLM 교육 자료 다운로드. PDF, 템플릿, 영상 자료를 무료로 제공합니다." path="/resources" />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">RESOURCES</span>
          <h1 className="page-title">자료실</h1>
          <p className="page-description">교육에 필요한 자료를 다운로드하세요</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* 카테고리 필터 */}
          <div className="resource-filter">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`resource-filter-btn${activeCategory === cat.value ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 자료 목록 */}
          {loading ? (
            <div className="loading-center">
              <div className="loading-spinner"></div>
            </div>
          ) : resources.length === 0 ? (
            <div className="empty-state">
              <p>등록된 자료가 없습니다.</p>
            </div>
          ) : (
            <div className="resource-grid">
              {resources.map((resource) => (
                <div className="resource-card fade-in" key={resource.id} ref={setFadeRef}>
                  <div className="resource-card-icon">
                    {categoryIcons[resource.category] || '📁'}
                  </div>
                  <div className="resource-card-body">
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <span className="resource-category-badge">{resource.category.toUpperCase()}</span>
                  </div>
                  <div className="resource-card-action">
                    {user ? (
                      resource.file_url ? (
                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">다운로드</a>
                      ) : resource.external_url ? (
                        <a href={resource.external_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">바로가기</a>
                      ) : null
                    ) : (
                      <Link to="/login" className="btn btn-outline btn-sm">로그인 필요</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>체계적인 교육이 필요하신가요?</h2>
            <p>자료만으로는 부족할 때, DreamIT Biz의 실전 교육 프로그램을 확인하세요.</p>
            <div className="cta-actions">
              <Link to="/consulting" className="btn btn-primary btn-lg">교육 프로그램 보기</Link>
              <Link to="/curriculum" className="btn btn-outline btn-lg">커리큘럼 보기</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Resources;
