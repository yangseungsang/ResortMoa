
import React, { useState } from 'react';
import { LoginPage } from './components/Auth/LoginPage';
import { verifyPassword } from './services/resortService';
import MainPage from './pages/MainPage';

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

  // 2. 인증된 경우 메인 페이지 즉시 렌더링 (Lazy Loading 제거로 로딩 문제 해결)
  return (
    <div className="min-h-[100svh] bg-slate-100">
        <MainPage />
    </div>
  );
};

export default App;
