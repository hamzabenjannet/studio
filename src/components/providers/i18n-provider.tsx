"use client";

import { NextIntlClientProvider } from 'next-intl';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';

type Locale = 'en' | 'fr';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');

  useEffect(() => {
    // Try to get locale from localStorage
    const savedLocale = localStorage.getItem('app-locale') as Locale;
    if (savedLocale && ['en', 'fr'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('app-locale', newLocale);
  };

  const messages = locale === 'en' ? enMessages : frMessages;

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Paris">
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}
