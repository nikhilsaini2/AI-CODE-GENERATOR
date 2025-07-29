// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import EditorPage from './components/EditorPage';
import { EditorStateProvider } from './state/editorStateStore';

// Component to handle scroll restoration
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    // Disable browser's default scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Always scroll to top on page load/refresh
    window.scrollTo(0, 0);
  }, []);

  return (
    <EditorStateProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </Router>
    </EditorStateProvider>
  );
}

export default App;