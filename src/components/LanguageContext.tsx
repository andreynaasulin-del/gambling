"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'ru' | 'en';

const translations = {
    ru: {
        // Header
        vipAccess: "VIP ACCESS",
        online: "online",

        // Title
        tryLuck: "Испытай удачу:",
        personalBonus: "Твой персональный бонус",
        exclusiveAccess: "Эксклюзивный доступ к приватному раунду бонусной игры.",

        // Slot Machine
        megaJackpot: "★ MEGA JACKPOT ★",
        attempt: "Попытка",
        of: "из",
        spotsLeft: "Осталось мест:",
        spin: "КРУТИТЬ",
        loading: "Загрузка VIP доступа...",

        // Win State
        jackpot: "ДЖЕКПОТ!",
        accessUnlocked: "Доступ разблокирован",
        bonusReady: "Бонус",
        bonusReadyEnd: "готов к активации",
        promoCode: "ПРОМОКОД:",
        copied: "Скопировано!",
        claimBonus: "ЗАБРАТЬ ВЫИГРЫШ НА 1WIN",
        timeLeft: "Времени осталось:",

        // Footer
        secure: "SECURE",
        ssl: "SSL 256-BIT",

        // Live Feed
        gotBonus: "получил +500% бонус",
        activatedSpins: "активировал 70 фриспинов",
        wonJackpot: "выиграл джекпот $15,000",
    },
    en: {
        // Header
        vipAccess: "VIP ACCESS",
        online: "online",

        // Title
        tryLuck: "Try your luck:",
        personalBonus: "Your personal bonus",
        exclusiveAccess: "Exclusive access to private bonus game round.",

        // Slot Machine
        megaJackpot: "★ MEGA JACKPOT ★",
        attempt: "Attempt",
        of: "of",
        spotsLeft: "Spots left:",
        spin: "SPIN",
        loading: "Loading VIP access...",

        // Win State
        jackpot: "JACKPOT!",
        accessUnlocked: "Access unlocked",
        bonusReady: "Bonus",
        bonusReadyEnd: "ready to activate",
        promoCode: "PROMO CODE:",
        copied: "Copied!",
        claimBonus: "CLAIM BONUS ON 1WIN",
        timeLeft: "Time remaining:",

        // Footer
        secure: "SECURE",
        ssl: "SSL 256-BIT",

        // Live Feed
        gotBonus: "got +500% bonus",
        activatedSpins: "activated 70 free spins",
        wonJackpot: "won jackpot $15,000",
    }
};

type TranslationKey = keyof typeof translations.ru;

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>('ru');

    useEffect(() => {
        // Check browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('en')) {
            setLocale('en');
        }

        // Check localStorage
        const saved = localStorage.getItem('locale') as Locale;
        if (saved && (saved === 'ru' || saved === 'en')) {
            setLocale(saved);
        }
    }, []);

    const handleSetLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);
    };

    const t = (key: TranslationKey): string => {
        return translations[locale][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}

export function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();

    return (
        <div style={{
            display: 'flex',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '4px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <button
                onClick={() => setLocale('ru')}
                style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: locale === 'ru' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                    color: locale === 'ru' ? '#3b82f6' : 'rgba(148, 163, 184, 0.7)',
                    transition: 'all 0.2s'
                }}
            >
                RU
            </button>
            <button
                onClick={() => setLocale('en')}
                style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: locale === 'en' ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                    color: locale === 'en' ? '#3b82f6' : 'rgba(148, 163, 184, 0.7)',
                    transition: 'all 0.2s'
                }}
            >
                EN
            </button>
        </div>
    );
}
