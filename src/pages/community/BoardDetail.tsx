import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import CommentSection from '../../components/CommentSection';
import { useAuth } from '../../contexts/AuthContext';
import { getBoardPost, deleteBoardPost } from '../../utils/boardStorage';
import type { BoardPost } from '../../utils/boardStorage';
import type { ReactElement } from 'react';

const BoardDetail = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<BoardPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPost(Number(id));
    }
  }, [id]);

  const loadPost = async (postId: number) => {
    setLoading(true);
    const data = await getBoardPost(postId);
    setPost(data);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!post || !confirm('정말 삭제하시겠습니까?')) return;
    const success = await deleteBoardPost(post.id);
    if (success) navigate('/community/board');
  };

  const isAuthor = user && post && user.id === post.author_id;
  const canModify = isAuthor || isAdmin;

  if (loading) {
    return (
      <section className="section">
        <div className="container"><div className="loading-center"><div className="loading-spinner"></div></div></div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty-state">
            <p>게시글을 찾을 수 없습니다.</p>
            <Link to="/community/board" className="btn btn-primary">목록으로</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <SEOHead title={post.title} description={post.content.slice(0, 100)} path={`/community/board/${post.id}`} />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">{post.category}</span>
          <h1 className="page-title">{post.title}</h1>
          <p className="page-description">{post.author_name} · {new Date(post.created_at).toLocaleDateString('ko-KR')} · 조회 {post.views}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="board-detail-content">
            <div className="board-detail-body" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
          </div>

          {canModify && (
            <div className="board-detail-actions">
              <Link to={`/community/board/write?edit=${post.id}`} className="btn btn-outline btn-sm">수정</Link>
              <button onClick={handleDelete} className="btn btn-outline btn-sm btn-danger">삭제</button>
            </div>
          )}

          <div className="board-detail-nav">
            <Link to="/community/board" className="btn btn-outline">목록으로</Link>
          </div>

          {/* 댓글 */}
          <CommentSection postId={post.id} postType="board" />
        </div>
      </section>
    </>
  );
};

export default BoardDetail;
