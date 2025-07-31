import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { COMPANY } from '@/lib/constants';

const navigation = [
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
];

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-dark-bg/95 backdrop-blur-sm border-b border-dark-card z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">
              {COMPANY.name.split(' ')[0]}
              <span className="text-accent-orange">.</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-text-secondary hover:text-white transition-colors text-sm uppercase tracking-wide"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 bg-accent-orange text-white px-4 py-2 rounded-xl hover:bg-opacity-90 transition-colors text-sm font-medium"
          >
            Get Started
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </header>
  );
}