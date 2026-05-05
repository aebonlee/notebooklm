import { lazy, Suspense, useEffect, type ReactElement } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import AdminGuard from '../components/AdminGuard';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import site from '../config/site';

// 페이지 lazy import
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Features = lazy(() => import('../pages/Features'));
const Curriculum = lazy(() => import('../pages/Curriculum'));
const Techniques = lazy(() => import('../pages/Techniques'));
const Consulting = lazy(() => import('../pages/Consulting'));
const Guide = lazy(() => import('../pages/Guide'));
const UseCases = lazy(() => import('../pages/UseCases'));
const Resources = lazy(() => import('../pages/Resources'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Chapter pages
const Chapter1 = lazy(() => import('../pages/curriculum/Chapter1'));
const Chapter2 = lazy(() => import('../pages/curriculum/Chapter2'));
const Chapter3 = lazy(() => import('../pages/curriculum/Chapter3'));
const Chapter4 = lazy(() => import('../pages/curriculum/Chapter4'));
const Chapter5 = lazy(() => import('../pages/curriculum/Chapter5'));
const Chapter6 = lazy(() => import('../pages/curriculum/Chapter6'));
const Chapter7 = lazy(() => import('../pages/curriculum/Chapter7'));

// Community pages
const Board = lazy(() => import('../pages/community/Board'));
const BoardDetail = lazy(() => import('../pages/community/BoardDetail'));
const BoardWrite = lazy(() => import('../pages/community/BoardWrite'));
const Gallery = lazy(() => import('../pages/community/Gallery'));

// Admin
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

// Auth 페이지 (features.auth로 토글)
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const MyPage = lazy(() => import('../pages/MyPage'));

// Shop 페이지 (features.shop으로 토글)
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const OrderConfirmation = lazy(() => import('../pages/OrderConfirmation'));
const OrderHistory = lazy(() => import('../pages/OrderHistory'));

const Loading = (): ReactElement => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div className="loading-spinner"></div>
  </div>
);

const ScrollToTop = (): null => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // hash가 있으면 해당 요소로 스크롤, 없으면 최상단
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const PublicLayout = (): ReactElement => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Site pages */}
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/techniques" element={<Techniques />} />
            <Route path="/consulting" element={<Consulting />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/resources" element={<Resources />} />

            {/* Chapter pages */}
            <Route path="/curriculum/ch1" element={<Chapter1 />} />
            <Route path="/curriculum/ch2" element={<Chapter2 />} />
            <Route path="/curriculum/ch3" element={<Chapter3 />} />
            <Route path="/curriculum/ch4" element={<Chapter4 />} />
            <Route path="/curriculum/ch5" element={<Chapter5 />} />
            <Route path="/curriculum/ch6" element={<Chapter6 />} />
            <Route path="/curriculum/ch7" element={<Chapter7 />} />

            {/* Community */}
            {site.features.community && (
              <>
                <Route path="/community/board" element={<Board />} />
                <Route path="/community/board/:id" element={<BoardDetail />} />
                <Route path="/community/board/write" element={<AuthGuard><BoardWrite /></AuthGuard>} />
                <Route path="/community/gallery" element={<Gallery />} />
              </>
            )}

            {/* Admin */}
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />

            {/* Auth */}
            {site.features.auth && (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/mypage" element={<AuthGuard><MyPage /></AuthGuard>} />
                <Route path="/mypage/orders" element={<AuthGuard><OrderHistory /></AuthGuard>} />
              </>
            )}

            {/* Shop */}
            {site.features.shop && (
              <>
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
              </>
            )}

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
