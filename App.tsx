import React from 'react';
import MainPage from './pages/MainPage';

// Using HashRouter logic but implementing simple conditional rendering for this SPA 
// since complex routing isn't strictly necessary for the single main dashboard view requested.
// If needed, we could wrap this in a HashRouter.

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <MainPage />
    </div>
  );
};

export default App;