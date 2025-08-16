import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const showHeader = pathname !== '/'; // hide header only on home

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
