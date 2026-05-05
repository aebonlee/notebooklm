import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import { useAuth } from '../../contexts/AuthContext';
import { createBoardPost, getBoardPost, updateBoardPost } from '../../utils/boardStorage';
import type { ReactElement } from 'react';

const categories = ['공지', '팁', '질문', '자유', '활용사례'];

const BoardWrite = (): ReactElement => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('자유');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editId) {
      loadPost(Number(editId));
    }
  }, [editId]);

  const loadPost = async (id: number) => {
    const post = await getBoardPost(id);
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !content.trim()) return;

    setSubmitting(true);

    if (editId) {
      const success = await updateBoardPost(Number(editId), { title, content, category });
      if (success) navigate(`/community/board/${editId}`);
    } else {
      const post = await createBoardPost({
        title,
        content,
        category,
        author_id: user.id,
        author_name: profile?.display_name || user.email?.split('@')[0] || '익명',
      });
      if (post) navigate(`/community/board/${post.id}`);
    }

    setSubmitting(false);
  };

  return (
    <>
      <SEOHead title={editId ? '게시글 수정' : '글쓰기'} path="/community/board/write" />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">WRITE</span>
          <h1 className="page-title">{editId ? '게시글 수정' : '글쓰기'}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <form className="board-write-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="category">카테고리</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">내용</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={15}
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>취소</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? '저장 중...' : (editId ? '수정하기' : '작성하기')}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default BoardWrite;
