import { useState, useEffect, useRef, useCallback } from 'react';
import SEOHead from '../../components/SEOHead';
import getSupabase, { TABLES } from '../../utils/supabase';
import type { ReactElement } from 'react';

interface GalleryItem {
  id: number;
  title: string;
  title_en?: string;
  description?: string;
  image_url: string;
  category: string;
  author_id?: string;
  date: string;
}

const categories = [
  { value: 'all', label: '전체' },
  { value: '산출물', label: '산출물' },
  { value: '마인드맵', label: '마인드맵' },
  { value: '슬라이드', label: '슬라이드' },
  { value: '인포그래픽', label: '인포그래픽' },
];

const Gallery = (): ReactElement => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
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
  }, [items]);

  useEffect(() => {
    loadGallery();
  }, [activeCategory]);

  const loadGallery = async () => {
    setLoading(true);
    const client = getSupabase();
    if (!client) { setLoading(false); return; }

    let query = client
      .from(TABLES.gallery_items)
      .select('*')
      .order('date', { ascending: false });

    if (activeCategory !== 'all') {
      query = query.eq('category', activeCategory);
    }

    const { data } = await query;
    setItems((data || []) as GalleryItem[]);
    setLoading(false);
  };

  return (
    <>
      <SEOHead title="갤러리" description="NotebookLM 활용 작업물 갤러리. 산출물, 마인드맵, 슬라이드를 공유합니다." path="/community/gallery" />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">GALLERY</span>
          <h1 className="page-title">갤러리</h1>
          <p className="page-description">NotebookLM으로 만든 작업물을 공유합니다</p>
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

          {/* 갤러리 그리드 */}
          {loading ? (
            <div className="loading-center"><div className="loading-spinner"></div></div>
          ) : items.length === 0 ? (
            <div className="empty-state"><p>등록된 작업물이 없습니다.</p></div>
          ) : (
            <div className="gallery-grid">
              {items.map((item) => (
                <div
                  className="gallery-card fade-in"
                  key={item.id}
                  ref={setFadeRef}
                  onClick={() => setLightbox(item)}
                >
                  <div className="gallery-card-img">
                    <img src={item.image_url} alt={item.title} loading="lazy" />
                  </div>
                  <div className="gallery-card-body">
                    <h3>{item.title}</h3>
                    <span className="gallery-cat-badge">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>×</button>
            <img src={lightbox.image_url} alt={lightbox.title} />
            <div className="lightbox-info">
              <h3>{lightbox.title}</h3>
              {lightbox.description && <p>{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
