import { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
];

export const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-2"
      >
        <Globe className="h-4 w-4" />
        <span>{language.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left text-sm transition-colors ${
                language === lang.code
                  ? 'bg-primary-50 font-semibold text-primary-700'
                  : 'text-text-primary hover:bg-surface-2'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};