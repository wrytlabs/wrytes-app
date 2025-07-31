import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Header />
      <main className="">
        {children}
      </main>
      <Footer />
    </div>
  );
}