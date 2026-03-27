"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Copy, Check, Clock } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

// === ANALYTICS TRACKING ===
declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
        fbq?: (...args: unknown[]) => void;
        gtag?: (...args: unknown[]) => void;
    }
}

const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ event: eventName, ...params });
    }
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', eventName, params);
    }
};

// === PREMIUM SVG SYMBOLS ===
const SymbolSVG = {
    seven: (
        <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="sevenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <filter id="sevenGlow"><feGaussianBlur stdDeviation="2" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
            </defs>
            <text x="30" y="48" fontSize="48" fontWeight="900" textAnchor="middle" fill="url(#sevenGrad)" filter="url(#sevenGlow)">7</text>
        </svg>
    ),
    diamond: (
        <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="diamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a5f3fc" /><stop offset="50%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
            </defs>
            <polygon points="30,5 55,25 30,55 5,25" fill="url(#diamGrad)" />
            <polygon points="30,5 42,25 30,55 18,25" fill="rgba(255,255,255,0.3)" />
        </svg>
    ),
    bar: (
        <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
            <defs><linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
            <rect x="8" y="18" width="44" height="24" rx="4" fill="url(#barGrad)" stroke="#c084fc" strokeWidth="2" />
            <text x="30" y="36" fontSize="14" fontWeight="900" textAnchor="middle" fill="#fff">BAR</text>
        </svg>
    ),
    cherry: (
        <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
            <defs><linearGradient id="cherryGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#dc2626" /></linearGradient></defs>
            <circle cx="20" cy="40" r="12" fill="url(#cherryGrad)" /><circle cx="40" cy="40" r="12" fill="url(#cherryGrad)" />
            <path d="M20 28 Q30 5 40 28" stroke="#22c55e" strokeWidth="3" fill="none" />
            <ellipse cx="32" cy="10" rx="6" ry="4" fill="#22c55e" />
        </svg>
    ),
    coin: (
        <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
            <defs><linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fde047" /><stop offset="50%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" /></linearGradient></defs>
            <circle cx="30" cy="30" r="24" fill="url(#coinGrad)" stroke="#fcd34d" strokeWidth="3" />
            <text x="30" y="38" fontSize="24" fontWeight="900" textAnchor="middle" fill="#b45309">$</text>
        </svg>
    )
};

const SYMBOLS = ['seven', 'diamond', 'bar', 'cherry', 'coin'] as const;
type SymbolKey = typeof SYMBOLS[number];

// === REEL ===
const Reel = ({ isSpinning, stopDelay, finalSymbol, onStopped }: {
    isSpinning: boolean; stopDelay: number; finalSymbol: SymbolKey; onStopped: () => void
}) => {
    const [currentSymbol, setCurrentSymbol] = useState<SymbolKey>('seven');
    const [spinning, setSpinning] = useState(false);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        if (isSpinning && !hasStartedRef.current) {
            hasStartedRef.current = true;
            setSpinning(true);
            const interval = setInterval(() => {
                setCurrentSymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
            }, 60);
            setTimeout(() => {
                clearInterval(interval);
                setCurrentSymbol(finalSymbol);
                setSpinning(false);
                hasStartedRef.current = false;
                onStopped();
            }, stopDelay);
        }
    }, [isSpinning, stopDelay, finalSymbol, onStopped]);

    return (
        <motion.div
            animate={!spinning ? { y: [0, -6, 0] } : {}}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
                width: '85px', height: '100px', borderRadius: '12px',
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(180deg, #0c1428 0%, #1a2744 50%, #0c1428 100%)',
                border: '3px solid', borderImage: 'linear-gradient(180deg, #fbbf24, #b45309, #fbbf24) 1',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 0 20px rgba(251, 191, 36, 0.3)'
            }}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)', zIndex: 5 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', zIndex: 5 }} />
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '12px', filter: spinning ? 'blur(4px)' : 'none'
            }}>
                {spinning ? (
                    <div style={{ width: '100%', height: '60%', background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)', filter: 'blur(8px)', animation: 'spin 0.1s linear infinite' }} />
                ) : (
                    <motion.div initial={{ scale: 0.5, rotateY: 180 }} animate={{ scale: 1, rotateY: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} style={{ width: '60px', height: '60px' }}>
                        {SymbolSVG[currentSymbol]}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

// === PROMO CODE ===
const PromoCode = ({ onCopy, copied }: { onCopy: () => void; copied: boolean }) => {
    const { t } = useLanguage();
    const [glitch, setGlitch] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 150); }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            borderRadius: '12px', padding: '14px',
            background: '#05070a', border: '4px solid #1e293b',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,1)', position: 'relative', overflow: 'hidden',
            fontFamily: "'Orbitron', monospace", width: '100%', boxSizing: 'border-box'
        }}>
            <div style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', marginBottom: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                • {t('promoCode')} •
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <motion.span
                    animate={glitch ? { x: [0, -3, 3, -1, 0] } : {}}
                    transition={{ duration: 0.15 }}
                    style={{
                        fontSize: 'clamp(20px, 7vw, 32px)', fontWeight: 900,
                        letterSpacing: 'clamp(1px, 1vw, 4px)', color: '#22d3ee',
                        fontFamily: "'Courier New', monospace",
                        textShadow: '0 0 5px #06b6d4, 0 0 10px #06b6d4, 0 0 20px #06b6d4',
                        filter: glitch ? 'hue-rotate(90deg)' : 'none'
                    }}
                >
                    OVERRIDE777
                </motion.span>
                <button onClick={onCopy} style={{
                    padding: '10px', borderRadius: '10px', marginLeft: '8px',
                    background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(251, 191, 36, 0.15)',
                    border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.5)' : 'rgba(251, 191, 36, 0.3)'}`,
                    cursor: 'pointer'
                }}>
                    {copied ? <Check size={18} color="#22c55e" /> : <Copy size={18} color="#fbbf24" />}
                </button>
            </div>
            {copied && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: '6px', fontSize: '11px', color: '#22c55e' }}>✓ {t('copied')}</motion.p>}
        </div>
    );
};

// === MAIN SLOT MACHINE ===
export default function LuxurySlotMachine() {
    const { t } = useLanguage();
    const [gameState, setGameState] = useState<"idle" | "spinning" | "won">("idle");
    const [stoppedReels, setStoppedReels] = useState(0);
    const [spinCount, setSpinCount] = useState(0);
    const [currentSymbols, setCurrentSymbols] = useState<[SymbolKey, SymbolKey, SymbolKey]>(['seven', 'seven', 'seven']);
    const [copied, setCopied] = useState(false);
    const [countdown, setCountdown] = useState({ minutes: 14, seconds: 59 });
    const [userId] = useState(() => `#${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    const [spotsLeft, setSpotsLeft] = useState(() => Math.floor(Math.random() * 5) + 3);
    const containerControls = useAnimation();

    const spinSoundRef = useRef<HTMLAudioElement | null>(null);
    const winSoundRef = useRef<HTMLAudioElement | null>(null);
    const reelStopRef = useRef<HTMLAudioElement | null>(null);

    const WIN_ON_SPIN = 2;

    useEffect(() => {
        spinSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
        winSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
        reelStopRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');
        [spinSoundRef, winSoundRef, reelStopRef].forEach(ref => { if (ref.current) { ref.current.load(); ref.current.volume = 0.3; } });
    }, []);

    const vibrate = (pattern: number | number[]) => { if ('vibrate' in navigator) navigator.vibrate(pattern); };

    useEffect(() => {
        const interval = setInterval(() => {
            setSpotsLeft(prev => { if (prev <= 1) return Math.floor(Math.random() * 3) + 2; return Math.random() > 0.7 ? prev - 1 : prev; });
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (gameState !== "won") return;
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState]);

    const handleSpin = () => {
        if (gameState !== "idle") return;
        const newSpinCount = spinCount + 1;
        setSpinCount(newSpinCount);

        if (newSpinCount >= WIN_ON_SPIN) {
            setCurrentSymbols(['seven', 'seven', 'seven']);
        } else {
            const losingCombos: [SymbolKey, SymbolKey, SymbolKey][] = [
                ['diamond', 'bar', 'cherry'], ['cherry', 'coin', 'diamond'], ['bar', 'diamond', 'coin'],
            ];
            setCurrentSymbols(losingCombos[newSpinCount - 1] || losingCombos[0]);
        }

        if (spinSoundRef.current) { spinSoundRef.current.currentTime = 0; spinSoundRef.current.play().catch(() => { }); }
        vibrate(50);
        trackEvent('slot_spin', { spin_number: newSpinCount });
        setGameState("spinning");
        setStoppedReels(0);
    };

    const handleReelStopped = useCallback(async () => {
        if (reelStopRef.current) { reelStopRef.current.currentTime = 0; reelStopRef.current.play().catch(() => { }); }
        vibrate(30);
        await containerControls.start({ x: [0, -4, 4, -2, 0], transition: { duration: 0.12 } });
        setStoppedReels(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
                setTimeout(() => {
                    if (spinCount >= WIN_ON_SPIN) {
                        if (winSoundRef.current) { winSoundRef.current.currentTime = 0; winSoundRef.current.play().catch(() => { }); }
                        vibrate([100, 50, 100, 50, 200]);
                        trackEvent('slot_jackpot', { spins_to_win: spinCount });
                        if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'Lead', { content_name: 'Jackpot Win' });
                        setGameState("won");
                        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#fde047', '#fbbf24', '#f59e0b', '#fff'] });
                        setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } }), 500);
                    } else {
                        setGameState("idle");
                    }
                }, 400);
            }
            return newCount;
        });
    }, [containerControls, spinCount]);

    const handleCopyCode = async () => {
        try { await navigator.clipboard.writeText("OVERRIDE777"); setCopied(true); trackEvent('promo_code_copied', { code: 'OVERRIDE777' }); setTimeout(() => setCopied(false), 2000); } catch { }
    };

    const handleCTAClick = () => {
        trackEvent('cta_click', { button: 'claim_bonus' });
        if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'InitiateCheckout', { content_name: '1WIN VIP Bonus', value: 500, currency: 'USD' });
        const urlParams = new URLSearchParams(window.location.search);
        const subId = urlParams.get("sub_id") || urlParams.get("subid") || "";
        window.location.href = subId
            ? `https://1wyycd.com/casino/list?open=register&p=6mw5&sub_id=${subId}`
            : "https://1wyycd.com/casino/list?open=register&p=6mw5";
    };

    return (
        <motion.div animate={containerControls} style={{ width: '100%' }}>
            <AnimatePresence mode="wait">
                {(gameState === "idle" || gameState === "spinning") && (
                    <motion.div key="game" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                        {/* SLOT FRAME */}
                        <div style={{
                            borderRadius: '16px', padding: '14px',
                            background: 'linear-gradient(180deg, #0a1628 0%, #050a14 100%)',
                            border: '3px solid', borderImage: 'linear-gradient(180deg, #fbbf24 0%, #b45309 50%, #fbbf24 100%) 1',
                            boxShadow: '0 0 40px rgba(251, 191, 36, 0.2), inset 0 0 60px rgba(0,0,0,0.5)',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            {/* Corner Lights */}
                            {[0, 1, 2, 3].map(i => (
                                <motion.div key={i}
                                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                                    style={{
                                        position: 'absolute', width: '6px', height: '6px', borderRadius: '50%',
                                        background: '#fbbf24', boxShadow: '0 0 15px #fbbf24',
                                        top: i < 2 ? '8px' : 'auto', bottom: i >= 2 ? '8px' : 'auto',
                                        left: i % 2 === 0 ? '8px' : 'auto', right: i % 2 === 1 ? '8px' : 'auto'
                                    }}
                                />
                            ))}

                            {/* Jackpot Label */}
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <motion.div
                                    animate={{ scale: [1, 1.03, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    style={{
                                        display: 'inline-block', padding: '6px 18px', borderRadius: '30px',
                                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.3) 100%)',
                                        border: '2px solid rgba(251, 191, 36, 0.5)'
                                    }}
                                >
                                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#fbbf24', letterSpacing: '3px' }}>{t('megaJackpot')}</span>
                                </motion.div>
                            </div>

                            {/* REELS */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative', padding: '8px 0' }}>
                                <Reel isSpinning={gameState === "spinning"} stopDelay={1200} finalSymbol={currentSymbols[0]} onStopped={handleReelStopped} />
                                <Reel isSpinning={gameState === "spinning"} stopDelay={1800} finalSymbol={currentSymbols[1]} onStopped={handleReelStopped} />
                                <Reel isSpinning={gameState === "spinning"} stopDelay={2400} finalSymbol={currentSymbols[2]} onStopped={handleReelStopped} />
                                <div style={{
                                    position: 'absolute', left: '5%', right: '5%', top: '50%', height: '4px',
                                    background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
                                    boxShadow: '0 0 15px #fbbf24', transform: 'translateY(-50%)'
                                }} />
                            </div>

                            {/* Status */}
                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <span style={{ fontSize: '11px', color: 'rgba(251, 191, 36, 0.6)', fontFamily: 'monospace' }}>
                                    {gameState === 'spinning' ? '• • •' : `${t('attempt')} ${spinCount + 1} ${t('of')} ${WIN_ON_SPIN}`}
                                </span>
                            </div>

                            {/* Spots Left */}
                            {gameState === 'idle' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{ textAlign: 'center', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                >
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                                        style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}
                                    />
                                    <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600 }}>
                                        {t('spotsLeft')} <span style={{ fontWeight: 800 }}>{spotsLeft}</span>
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        {/* SPIN BUTTON with PULSE */}
                        {gameState === "idle" && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: 1, y: 0,
                                    scale: [1, 1.03, 1],
                                    boxShadow: [
                                        'inset 0 2px 4px rgba(255,255,255,0.4), 0 8px 0 #92400e, 0 15px 20px rgba(0,0,0,0.4)',
                                        'inset 0 2px 4px rgba(255,255,255,0.4), 0 8px 0 #92400e, 0 15px 40px rgba(245, 158, 11, 0.5)',
                                        'inset 0 2px 4px rgba(255,255,255,0.4), 0 8px 0 #92400e, 0 15px 20px rgba(0,0,0,0.4)'
                                    ]
                                }}
                                transition={{
                                    scale: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
                                    boxShadow: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
                                }}
                                whileTap={{ scale: 0.98, y: 4 }}
                                onClick={handleSpin}
                                style={{
                                    width: '100%', marginTop: '12px', padding: '20px',
                                    borderRadius: '16px', cursor: 'pointer',
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
                                    borderTop: '1px solid rgba(255,255,255,0.5)',
                                    borderBottom: '1px solid rgba(0,0,0,0.3)',
                                    borderLeft: '1px solid rgba(255,255,255,0.2)',
                                    borderRight: '1px solid rgba(255,255,255,0.2)',
                                    fontSize: '22px', fontWeight: 900, color: 'white', letterSpacing: '4px',
                                    textShadow: '0 2px 0 rgba(0,0,0,0.2)',
                                    position: 'relative', overflow: 'hidden'
                                }}
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
                                    style={{
                                        position: 'absolute', inset: 0, width: '50%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                                        transform: 'skewX(-25deg)', filter: 'blur(5px)'
                                    }}
                                />
                                <span style={{ position: 'relative', zIndex: 2, textTransform: 'uppercase' }}>{t('spin')}</span>
                            </motion.button>
                        )}

                        {/* Spinning State */}
                        {gameState === "spinning" && (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                                    style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid #fbbf24', borderTopColor: 'transparent', borderRadius: '50%' }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}

                {/* === WON === */}
                {gameState === "won" && (
                    <motion.div key="win" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                        <div style={{
                            borderRadius: '16px', padding: '20px', textAlign: 'center',
                            background: 'linear-gradient(180deg, #0a1628 0%, #050a14 100%)',
                            border: '3px solid', borderImage: 'linear-gradient(180deg, #fbbf24 0%, #b45309 50%, #fbbf24 100%) 1',
                            boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), inset 0 0 40px rgba(0,0,0,0.5)',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                                style={{ fontSize: '56px', marginBottom: '12px' }}>🏆</motion.div>
                            <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '6px', color: '#fbbf24', textShadow: '0 0 30px rgba(251, 191, 36, 0.6)' }}>{t('jackpot')}</h2>
                            <p style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{t('accessUnlocked')}</p>
                            <p style={{ fontSize: '13px', color: 'rgba(148, 163, 184, 0.8)', marginBottom: '16px' }}>
                                {t('bonusReady')} <span style={{ color: '#fbbf24', fontWeight: 700 }}>+500%</span> {t('bonusReadyEnd')}
                            </p>
                            <PromoCode onCopy={handleCopyCode} copied={copied} />
                        </div>

                        {/* CTA Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: 1, y: 0, scale: [1, 1.02, 1],
                                boxShadow: [
                                    'inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 0 #166534, 0 8px 30px rgba(34, 197, 94, 0.4)',
                                    'inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 0 #166534, 0 15px 50px rgba(34, 197, 94, 0.6)',
                                    'inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 0 #166534, 0 8px 30px rgba(34, 197, 94, 0.4)'
                                ]
                            }}
                            transition={{ delay: 0.2, scale: { repeat: Infinity, duration: 1.5 }, boxShadow: { repeat: Infinity, duration: 1.5 } }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCTAClick}
                            style={{
                                width: '100%', marginTop: '12px', padding: '20px',
                                borderRadius: '16px', border: 'none', cursor: 'pointer',
                                background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                                fontSize: '16px', fontWeight: 900, color: 'white', letterSpacing: '1px',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                style={{ position: 'absolute', inset: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', transform: 'skewX(-15deg)' }}
                            />
                            <span style={{ position: 'relative', zIndex: 2 }}>💰 {t('claimBonus')}</span>
                        </motion.button>

                        {/* Trust footer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px', fontSize: '10px', color: 'rgba(148, 163, 184, 0.7)' }}>
                            <Clock size={11} color="#fbbf24" />
                            <span>{t('timeLeft')}</span>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'white' }}>
                                {String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                            </span>
                            <span>•</span>
                            <span>ID: <span style={{ color: '#fbbf24' }}>{userId}</span></span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
