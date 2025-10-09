import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTelegram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import { SOCIAL, COMPANY } from '@/lib/constants';

interface FooterItemProps {
  link: string;
  text: string;
  icon: IconProp;
}

export function FooterItem({ link, text, icon }: FooterItemProps) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noreferrer"
      className="flex gap-1 hover:opacity-70 transition-opacity"
    >
      <FontAwesomeIcon
        icon={icon}
        className="w-6 h-6 text-text-secondary hover:text-accent-orange transition-colors"
      />
      <div className="hidden sm:block text-text-secondary hover:text-accent-orange transition-colors">
        {text}
      </div>
    </Link>
  );
}

export default function Footer() {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className="bg-dark-bg border-t border-dark-card py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="text-text-muted text-sm">
            © {year} {COMPANY.name}. {COMPANY.location}
          </div>
          <ul className="flex items-center justify-center gap-8">
            <li>
              <FooterItem link={SOCIAL.Github_user} text="Github" icon={faGithub} />
            </li>
            <li>
              <FooterItem link={SOCIAL.Twitter} text="Twitter" icon={faXTwitter} />
            </li>
            <li>
              <FooterItem link={SOCIAL.Telegram} text="Telegram" icon={faTelegram} />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
