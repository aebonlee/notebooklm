import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import { useAuth } from '../../contexts/AuthContext';
import { getBoardPosts } from '../../utils/boardStorage';
import type { BoardPost } from '../../utils/boardStorage';
import type { ReactElement } from 'react';

const categories = [
  { value: 'all', label: '전체' },
  { value: '공지', label: '공지' },
  { value: '팁', label: '팁' },
  { value: '질문', label: '질문' },
  { value: '자유', label: '자유' },
  { value: '활용사례', label: '활용사례' },
];

const Board = (): ReactElement => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    loadPosts();
  }, [page, category]);

  const loadPosts = async () => {
    setLoading(true);
    const result = await getBoardPosts({ category, search: search || undefined, page, limit });
    setPosts(result.data);
    setTotalCount(result.count);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadPosts();
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      <SEOHead title="자유게시판" description="NotebookLM 학습 커뮤니티. 질문, 팁 공유, 활용 사례를 나눠보세요." path="/community/board" />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">COMMUNITY</span>
          <h1 className="page-title">자유게시판</h1>
          <p className="page-description">질문, 팁, 활용 사례를 자유롭게 공유하세요</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* 상단 컨트롤 */}
          <div className="board-controls">
            <div className="board-categories">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={`board-cat-btn${category === cat.value ? ' active' : ''}`}
                  onClick={() => { setCategory(cat.value); setPage(1); }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="board-actions">
              <form className="board-search" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm">검색</button>
              </form>
              {user && (
                <Link to="/community/board/write" className="btn btn-primary btn-sm">글쓰기</Link>
              )}
            </div>
          </div>

          {/* 게시글 목록 */}
          {loading ? (
            <div className="loading-center"><div className="loading-spinner"></div></div>
          ) : posts.length === 0 ? (
            <div className="empty-state"><p>게시글이 없습니다.</p></div>
          ) : (
            <div className="board-list">
              <div className="board-header-row">
                <span className="board-col-cat">카테고리</span>
                <span className="board-col-title">제목</span>
                <span className="board-col-author">작성자</span>
                <span className="board-col-date">작성일</span>
                <span className="board-col-views">조회</span>
              </div>
              {posts.map((post) => (
                <Link to={`/community/board/${post.id}`} className="board-row" key={post.id}>
                  <span className="board-col-cat"><span className="board-cat-badge">{post.category}</span></span>
                  <span className="board-col-title">{post.title}</span>
                  <span className="board-col-author">{post.author_name}</span>
                  <span className="board-col-date">{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                  <span className="board-col-views">{post.views}</span>
                </Link>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="board-pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-outline btn-sm">이전</button>
              <span className="board-page-info">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn btn-outline btn-sm">다음</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Board;
