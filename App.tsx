
import React, { useState, Suspense, lazy } from 'react';
import { LoginPage } from './components/Auth/LoginPage';
import { verifyPassword } from './services/resortService';

// Code Splitting: 메인 페이지는 로그인 후에만 로드합니다.
// 이렇게 하면 초기 진입 시 번들 사이즈가 줄어들어 로딩이 빨라집니다.
const MainPage = lazy(() => import('./pages/MainPage'));

const App: React.FC = () => {
  // Authentication State
  // sessionStorage를 사용하여 새로고침 시 로그인 유지, 브라우저 종료 시 로그아웃
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('auth_token') === 'valid';
  });

  const handleLogin = async (password: string): Promise<boolean> => {
    // Verify against the server
    const isValid = await verifyPassword(password);
    
    if (isValid) {
      sessionStorage.setItem('auth_token', 'valid');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // 1. 인증되지 않은 경우 로그인 페이지만 렌더링
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 2. 인증된 경우 메인 페이지 렌더링 (Lazy Loading 적용)
  return (
    <div className="min-h-[100svh] bg-slate-100">
      <Suspense fallback={
        <div className="h-[100svh] w-full flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center space-y-4">
             <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin shadow-sm"></div>
             <p className="text-slate-500 text-sm font-bold tracking-wide animate-pulse">Loading Resort Moa...</p>
          </div>
        </div>
      }>
        <MainPage />
      </Suspense>
    </div>
  );
};

export default App;
