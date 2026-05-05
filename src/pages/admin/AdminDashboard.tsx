import { useState, useEffect } from 'react';
import SEOHead from '../../components/SEOHead';
import getSupabase, { TABLES } from '../../utils/supabase';
import type { ReactElement } from 'react';

type TabKey = 'dashboard' | 'members' | 'orders' | 'posts' | 'resources';

interface Stats {
  members: number;
  orders: number;
  posts: number;
  resources: number;
}

const AdminDashboard = (): ReactElement => {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [stats, setStats] = useState<Stats>({ members: 0, orders: 0, posts: 0, resources: 0 });
  const [members, setMembers] = useState<Record<string, unknown>[]>([]);
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [resources, setResources] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'members') loadMembers();
    if (activeTab === 'posts') loadPosts();
    if (activeTab === 'resources') loadResources();
  }, [activeTab]);

  const loadStats = async () => {
    const client = getSupabase();
    if (!client) { setLoading(false); return; }

    const [membersRes, ordersRes, postsRes, resourcesRes] = await Promise.all([
      client.from('user_profiles').select('*', { count: 'exact', head: true }),
      client.from(TABLES.orders).select('*', { count: 'exact', head: true }),
      client.from(TABLES.board_posts).select('*', { count: 'exact', head: true }),
      client.from(TABLES.resources).select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      members: membersRes.count || 0,
      orders: ordersRes.count || 0,
      posts: postsRes.count || 0,
      resources: resourcesRes.count || 0,
    });
    setLoading(false);
  };

  const loadMembers = async () => {
    const client = getSupabase();
    if (!client) return;
    const { data } = await client.from('user_profiles').select('*').order('created_at', { ascending: false }).limit(50);
    setMembers(data || []);
  };

  const loadPosts = async () => {
    const client = getSupabase();
    if (!client) return;
    const { data } = await client.from(TABLES.board_posts).select('*').order('created_at', { ascending: false }).limit(50);
    setPosts(data || []);
  };

  const loadResources = async () => {
    const client = getSupabase();
    if (!client) return;
    const { data } = await client.from(TABLES.resources).select('*').order('sort_order', { ascending: true });
    setResources(data || []);
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    const client = getSupabase();
    if (!client) return;
    await client.from(TABLES.board_posts).delete().eq('id', id);
    setPosts(posts.filter(p => (p as { id: number }).id !== id));
  };

  const handleDeleteResource = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    const client = getSupabase();
    if (!client) return;
    await client.from(TABLES.resources).delete().eq('id', id);
    setResources(resources.filter(r => (r as { id: number }).id !== id));
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'dashboard', label: '대시보드' },
    { key: 'members', label: '회원관리' },
    { key: 'orders', label: '주문관리' },
    { key: 'posts', label: '게시판관리' },
    { key: 'resources', label: '자료관리' },
  ];

  return (
    <>
      <SEOHead title="관리자" path="/admin" />

      <section className="page-header">
        <div className="container">
          <span className="page-badge">ADMIN</span>
          <h1 className="page-title">관리자 대시보드</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* 탭 메뉴 */}
          <div className="admin-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`admin-tab${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 대시보드 탭 */}
          {activeTab === 'dashboard' && (
            <div className="admin-dashboard-grid">
              {loading ? (
                <div className="loading-center"><div className="loading-spinner"></div></div>
              ) : (
                <>
                  <div className="admin-stat-card">
                    <span className="admin-stat-number">{stats.members}</span>
                    <span className="admin-stat-label">총 회원 수</span>
                  </div>
                  <div className="admin-stat-card">
                    <span className="admin-stat-number">{stats.orders}</span>
                    <span className="admin-stat-label">총 주문</span>
                  </div>
                  <div className="admin-stat-card">
                    <span className="admin-stat-number">{stats.posts}</span>
                    <span className="admin-stat-label">총 게시글</span>
                  </div>
                  <div className="admin-stat-card">
                    <span className="admin-stat-number">{stats.resources}</span>
                    <span className="admin-stat-label">총 자료</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 회원관리 탭 */}
          {activeTab === 'members' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>이름</th><th>이메일</th><th>역할</th><th>가입일</th></tr>
                </thead>
                <tbody>
                  {members.map((m, i) => (
                    <tr key={i}>
                      <td>{(m.display_name as string) || '-'}</td>
                      <td>{(m.email as string) || '-'}</td>
                      <td><span className="admin-role-badge">{(m.role as string) || 'member'}</span></td>
                      <td>{m.created_at ? new Date(m.created_at as string).toLocaleDateString('ko-KR') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 주문관리 탭 */}
          {activeTab === 'orders' && (
            <div className="admin-table-wrap">
              <p className="admin-info-text">주문 관리는 마이페이지 &gt; 주문이력에서 확인할 수 있습니다.</p>
            </div>
          )}

          {/* 게시판관리 탭 */}
          {activeTab === 'posts' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>ID</th><th>제목</th><th>카테고리</th><th>작성자</th><th>작성일</th><th>액션</th></tr>
                </thead>
                <tbody>
                  {posts.map((p, i) => (
                    <tr key={i}>
                      <td>{(p.id as number)}</td>
                      <td>{(p.title as string)}</td>
                      <td>{(p.category as string)}</td>
                      <td>{(p.author_name as string) || '-'}</td>
                      <td>{p.created_at ? new Date(p.created_at as string).toLocaleDateString('ko-KR') : '-'}</td>
                      <td>
                        <button className="btn btn-outline btn-xs btn-danger" onClick={() => handleDeletePost(p.id as number)}>삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 자료관리 탭 */}
          {activeTab === 'resources' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>ID</th><th>제목</th><th>카테고리</th><th>활성</th><th>액션</th></tr>
                </thead>
                <tbody>
                  {resources.map((r, i) => (
                    <tr key={i}>
                      <td>{(r.id as number)}</td>
                      <td>{(r.title as string)}</td>
                      <td>{(r.category as string)}</td>
                      <td>{(r.is_active as boolean) ? '활성' : '비활성'}</td>
                      <td>
                        <button className="btn btn-outline btn-xs btn-danger" onClick={() => handleDeleteResource(r.id as number)}>삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
