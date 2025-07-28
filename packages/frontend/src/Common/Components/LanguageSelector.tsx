import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const currentLang = i18n.language;

  const changeLanguage = (lang: string) => {
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-right">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-1 border border-gray-400 rounded-full text-sm font-bold text-gray-800 bg-transparent hover:bg-gray-100 transition"
      >
        {currentLang.toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <button
            onClick={() => changeLanguage('he')}
            className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100"
          >
            עברית
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100"
          >
            English
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
