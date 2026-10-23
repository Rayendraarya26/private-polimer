import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/90 bg-white/70 backdrop-blur-xs py-3.5 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Copyright */}
        <div className="order-2 md:order-1 text-slate-500 font-medium flex items-center gap-1.5">
          <span>{currentYear}&copy;</span>
          <a
            href="/"
            className="text-slate-800 hover:text-brand-700 font-semibold transition-colors"
          >
            JIS - Polimer
          </a>
        </div>

        {/* Menu Links */}
        <ul className="order-1 md:order-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-slate-600 font-medium">
          <li>
            <a
              href="/faq"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-700 transition-colors py-1 px-1"
            >
              FAQ
            </a>
          </li>
          <li>
            <a
              href="/tte/verify"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-700 transition-colors py-1 px-1"
            >
              TTE Verification
            </a>
          </li>
          <li>
            <a
              href="/tracking/permohonan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-700 transition-colors py-1 px-1"
            >
              Lacak Permohonan
            </a>
          </li>
          <li>
            <a
              href="https://bbkkp.kemenperin.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-700 transition-colors py-1 px-1"
            >
              Portal Kemenperin
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
