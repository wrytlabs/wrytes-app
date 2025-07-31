import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
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