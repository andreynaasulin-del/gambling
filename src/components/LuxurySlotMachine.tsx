"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Copy, Check, Clock } from "lucide-react";

// === ANALYTICS TRACKING ===
declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
        fbq?: (...args: unknown[]) => void;
        gtag?: (...args: unknown[]) => void;
    }
}

const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
    // GTM / GA4
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({ event: eventName, ...params });
    }
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
    // Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', eventName, params);
    }
    console.log('[Analytics]', eventName, params);
};

// === PREMIUM SVG SYMBOLS (Cyberpunk Style) ===
const SymbolSVG = {
    seven: (
        <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="sevenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <filter id="sevenGlow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <text x="30" y="48" fontSize="48" fontWeight="900" textAnchor="middle" fill="url(#sevenGrad)" filter="url(#sevenGlow)">7</text>
        </svg>
    ),
    diamond: (
        <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="diamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a5f3fc" />
                    <stop offset="50%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
                <filter id="diamGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <polygon points="30,5 55,25 30,55 5,25" fill="url(#diamGrad)" filter="url(#diamGlow)" />
            <polygon points="30,5 42,25 30,55 18,25" fill="rgba(255,255,255,0.3)" />
        </svg>
    ),
    bar: (
        <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
            </defs>
            <rect x="8" y="18" width="44" height="24" rx="4" fill="url(#barGrad)" stroke="#c084fc" strokeWidth="2" />
            <text x="30" y="36" fontSize="14" fontWeight="900" textAnchor="middle" fill="#fff">BAR</text>
        </svg>
    ),
    cherry: (
        <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="cherryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <radialGradient id="cherryShine" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>
            <circle cx="20" cy="40" r="12" fill="url(#cherryGrad)" />
            <circle cx="20" cy="40" r="12" fill="url(#cherryShine)" />
            <circle cx="40" cy="40" r="12" fill="url(#cherryGrad)" />
            <circle cx="40" cy="40" r="12" fill="url(#cherryShine)" />
            <path d="M20 28 Q30 5 40 28" stroke="#22c55e" strokeWidth="3" fill="none" />
            <ellipse cx="32" cy="10" rx="6" ry="4" fill="#22c55e" />
        </svg>
    ),
    coin: (
        <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
            </defs>
            <circle cx="30" cy="30" r="24" fill="url(#coinGrad)" stroke="#fcd34d" strokeWidth="3" />
            <circle cx="30" cy="30" r="18" fill="none" stroke="#b45309" strokeWidth="2" />
            <text x="30" y="38" fontSize="24" fontWeight="900" textAnchor="middle" fill="#b45309">$</text>
        </svg>
    )
};

const SYMBOLS = ['seven', 'diamond', 'bar', 'cherry', 'coin', 'onewin'] as const;
type SymbolKey = typeof SYMBOLS[number];

// Add 1WIN symbol (exact traced from reference)
const Symbol1Win = (
    <svg viewBox="0 0 200 80" style={{ width: '100%', height: '100%' }}>
        {/* The "1" with rounded top */}
        <path d="M5 75 L5 35 Q5 20, 20 20 L30 20 Q40 20, 40 35 L40 75 Q40 78, 35 78 L10 78 Q5 78, 5 75 Z M20 20 Q10 20, 10 15 Q10 8, 20 8 L25 8 Q32 8, 32 15 Q32 20, 25 20 Z" fill="white" />
        {/* The "w" */}
        <path d="M50 20 Q45 20, 45 28 L45 75 Q45 78, 50 78 L55 78 Q60 78, 62 72 L75 45 L88 72 Q90 78, 95 78 L100 78 Q105 78, 105 75 L105 28 Q105 20, 100 20 L95 20 Q90 20, 90 28 L90 55 L80 35 Q78 30, 75 30 Q72 30, 70 35 L60 55 L60 28 Q60 20, 55 20 Z" fill="white" />
        {/* The "i" dot */}
        <circle cx="125" cy="12" r="10" fill="white" />
        {/* The "i" body */}
        <path d="M115 25 Q115 20, 120 20 L130 20 Q135 20, 135 25 L135 75 Q135 78, 130 78 L120 78 Q115 78, 115 75 Z" fill="white" />
        {/* The "n" */}
        <path d="M145 75 L145 28 Q145 20, 155 20 Q175 20, 185 35 L185 75 Q185 78, 180 78 L175 78 Q170 78, 170 75 L170 45 Q165 30, 160 30 L160 75 Q160 78, 155 78 L150 78 Q145 78, 145 75 Z" fill="white" />
    </svg>
);

// Update SymbolSVG to include onewin
const SymbolSVGMap: Record<SymbolKey, React.ReactNode> = {
    seven: SymbolSVG.seven,
    diamond: SymbolSVG.diamond,
    bar: SymbolSVG.bar,
    cherry: SymbolSVG.cherry,
    coin: SymbolSVG.coin,
    onewin: Symbol1Win
};

// === PREMIUM REEL ===
const Reel = ({ isSpinning, stopDelay, finalSymbol, onStopped }: {
    isSpinning: boolean;
    stopDelay: number;
    finalSymbol: SymbolKey;
    onStopped: () => void
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
                width: '90px',
                height: '110px',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #0c1428 0%, #1a2744 50%, #0c1428 100%)',
                border: '3px solid',
                borderImage: 'linear-gradient(180deg, #fbbf24, #b45309, #fbbf24) 1',
                boxShadow: `
          inset 0 0 30px rgba(0,0,0,0.8),
          inset 0 2px 0 rgba(255,255,255,0.1),
          0 0 20px rgba(251, 191, 36, 0.3),
          0 4px 15px rgba(0,0,0,0.5)
        `
            }}
        >
            {/* Shine Effect */}
            <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '50%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    transform: 'skewX(-15deg)',
                    zIndex: 10
                }}
            />

            {/* Top/Bottom Shadows */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)',
                zIndex: 5
            }} />
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                zIndex: 5
            }} />

            {/* Symbol */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '15px',
                filter: spinning ? 'blur(4px)' : 'none',
                transition: 'filter 0.1s'
            }}>
                {spinning ? (
                    <div style={{
                        width: '100%', height: '60%',
                        background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',
                        filter: 'blur(8px)',
                        animation: 'spin 0.1s linear infinite'
                    }} />
                ) : (
                    <motion.div
                        initial={{ scale: 0.5, rotateY: 180 }}
                        animate={{ scale: 1, rotateY: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        style={{ width: '65px', height: '65px' }}
                    >
                        {SymbolSVGMap[currentSymbol]}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

// === PROMO CODE DISPLAY ===
const PromoCode = ({ onCopy, copied }: { onCopy: () => void; copied: boolean }) => {
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 150);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            borderRadius: '16px', padding: '20px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
            border: '2px solid rgba(251, 191, 36, 0.4)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 0 30px rgba(251, 191, 36, 0.15)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Scanlines */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.05,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
            }} />

            <div style={{ fontSize: '10px', color: 'rgba(251, 191, 36, 0.6)', fontFamily: 'monospace', marginBottom: '8px', letterSpacing: '2px' }}>
        // PROMO_CODE
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <motion.span
                    animate={glitch ? { x: [0, -3, 3, -1, 0], skewX: [0, 5, -3, 0] } : {}}
                    transition={{ duration: 0.15 }}
                    style={{
                        fontSize: '28px', fontWeight: 900, letterSpacing: '3px',
                        color: '#fbbf24', fontFamily: 'monospace',
                        textShadow: '0 0 10px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.2)'
                    }}
                >
                    OVERRIDE777
                </motion.span>

                <button
                    onClick={onCopy}
                    style={{
                        padding: '12px', borderRadius: '10px',
                        background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(251, 191, 36, 0.15)',
                        border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.5)' : 'rgba(251, 191, 36, 0.3)'}`,
                        cursor: 'pointer', transition: 'all 0.2s'
                    }}
                >
                    {copied ? <Check size={20} color="#22c55e" /> : <Copy size={20} color="#fbbf24" />}
                </button>
            </div>

            {copied && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#22c55e' }}>
                    ✓ Скопировано!
                </motion.p>
            )}
        </div>
    );
};

// === MAIN SLOT MACHINE ===
export default function LuxurySlotMachine() {
    const [gameState, setGameState] = useState<"idle" | "spinning" | "won">("idle");
    const [stoppedReels, setStoppedReels] = useState(0);
    const [spinCount, setSpinCount] = useState(0);
    const [currentSymbols, setCurrentSymbols] = useState<[SymbolKey, SymbolKey, SymbolKey]>(['seven', 'seven', 'seven']);
    const [copied, setCopied] = useState(false);
    const [countdown, setCountdown] = useState({ minutes: 14, seconds: 59 });
    const [userId] = useState(() => `#${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    const [spotsLeft, setSpotsLeft] = useState(() => Math.floor(Math.random() * 5) + 3);
    const containerControls = useAnimation();

    // Sound refs
    const spinSoundRef = useRef<HTMLAudioElement | null>(null);
    const winSoundRef = useRef<HTMLAudioElement | null>(null);
    const reelStopRef = useRef<HTMLAudioElement | null>(null);

    const WIN_ON_SPIN = 5;

    // Initialize sounds
    useEffect(() => {
        spinSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
        winSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
        reelStopRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');

        // Preload
        [spinSoundRef, winSoundRef, reelStopRef].forEach(ref => {
            if (ref.current) {
                ref.current.load();
                ref.current.volume = 0.3;
            }
        });
    }, []);

    // Vibrate helper
    const vibrate = (pattern: number | number[]) => {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    };

    // Spots countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setSpotsLeft(prev => {
                if (prev <= 1) return Math.floor(Math.random() * 3) + 2;
                return Math.random() > 0.7 ? prev - 1 : prev;
            });
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

        // Determine symbols for this spin
        if (newSpinCount >= WIN_ON_SPIN) {
            // WINNING spin - all 7s
            setCurrentSymbols(['seven', 'seven', 'seven']);
        } else {
            // LOSING spin - random non-winning combination
            const losingCombos: [SymbolKey, SymbolKey, SymbolKey][] = [
                ['diamond', 'bar', 'cherry'],
                ['cherry', 'coin', 'diamond'],
                ['bar', 'diamond', 'coin'],
                ['coin', 'cherry', 'bar'],
                ['diamond', 'cherry', 'coin'],
            ];
            setCurrentSymbols(losingCombos[newSpinCount - 1] || losingCombos[0]);
        }

        // Play spin sound
        if (spinSoundRef.current) {
            spinSoundRef.current.currentTime = 0;
            spinSoundRef.current.play().catch(() => { });
        }
        vibrate(50);

        // Track spin event
        trackEvent('slot_spin', { spin_number: newSpinCount });

        setGameState("spinning");
        setStoppedReels(0);
    };

    const handleReelStopped = useCallback(async () => {
        // Reel stop sound + vibration
        if (reelStopRef.current) {
            reelStopRef.current.currentTime = 0;
            reelStopRef.current.play().catch(() => { });
        }
        vibrate(30);

        await containerControls.start({ x: [0, -4, 4, -2, 0], transition: { duration: 0.12 } });
        setStoppedReels(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
                setTimeout(() => {
                    if (spinCount >= WIN_ON_SPIN) {
                        // WIN! Play win sound + long vibration
                        if (winSoundRef.current) {
                            winSoundRef.current.currentTime = 0;
                            winSoundRef.current.play().catch(() => { });
                        }
                        vibrate([100, 50, 100, 50, 200]);

                        // Track jackpot win
                        trackEvent('slot_jackpot', { spins_to_win: spinCount });

                        // FB Pixel Lead event
                        if (typeof window !== 'undefined' && window.fbq) {
                            window.fbq('track', 'Lead', { content_name: 'Jackpot Win' });
                        }

                        setGameState("won");
                        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#fde047', '#fbbf24', '#f59e0b', '#fff'] });
                        setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } }), 500);
                    } else {
                        // Not a win, back to idle
                        setGameState("idle");
                    }
                }, 400);
            }
            return newCount;
        });
    }, [containerControls, spinCount]);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText("OVERRIDE777");
            setCopied(true);
            trackEvent('promo_code_copied', { code: 'OVERRIDE777' });
            setTimeout(() => setCopied(false), 2000);
        } catch (e) { }
    };

    const handleCTAClick = () => {
        // Track CTA click
        trackEvent('cta_click', { button: 'claim_bonus' });

        // FB Pixel - InitiateCheckout (conversion event)
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'InitiateCheckout', {
                content_name: '1WIN VIP Bonus',
                value: 500,
                currency: 'USD'
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const subId = urlParams.get("sub_id") || urlParams.get("subid") || "";
        window.location.href = subId
            ? `https://1wwndp.com/casino/list?open=register&p=hcbi&sub_id=${subId}`
            : "https://1wwndp.com/casino/list?open=register&p=hcbi";
    };

    return (
        <motion.div animate={containerControls} style={{ width: '100%' }}>
            <AnimatePresence mode="wait">
                {/* === IDLE / SPINNING === */}
                {(gameState === "idle" || gameState === "spinning") && (
                    <motion.div key="game" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                        {/* SLOT MACHINE FRAME */}
                        <div style={{
                            borderRadius: '20px', padding: '20px',
                            background: 'linear-gradient(180deg, #0a1628 0%, #050a14 100%)',
                            border: '3px solid',
                            borderImage: 'linear-gradient(180deg, #fbbf24 0%, #b45309 50%, #fbbf24 100%) 1',
                            boxShadow: `
                0 0 40px rgba(251, 191, 36, 0.2),
                0 0 80px rgba(251, 191, 36, 0.1),
                inset 0 0 60px rgba(0,0,0,0.5),
                0 20px 40px rgba(0,0,0,0.4)
              `,
                            position: 'relative', overflow: 'hidden'
                        }}>
                            {/* Corner Lights */}
                            {[0, 1, 2, 3].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: '#fbbf24',
                                        boxShadow: '0 0 15px #fbbf24',
                                        top: i < 2 ? '10px' : 'auto',
                                        bottom: i >= 2 ? '10px' : 'auto',
                                        left: i % 2 === 0 ? '10px' : 'auto',
                                        right: i % 2 === 1 ? '10px' : 'auto'
                                    }}
                                />
                            ))}

                            {/* Jackpot Label */}
                            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                <motion.div
                                    animate={{ scale: [1, 1.03, 1], textShadow: ['0 0 20px rgba(251, 191, 36, 0.5)', '0 0 40px rgba(251, 191, 36, 0.8)', '0 0 20px rgba(251, 191, 36, 0.5)'] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    style={{
                                        display: 'inline-block', padding: '10px 24px', borderRadius: '30px',
                                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.3) 100%)',
                                        border: '2px solid rgba(251, 191, 36, 0.5)'
                                    }}
                                >
                                    <span style={{ fontSize: '14px', fontWeight: 900, color: '#fbbf24', letterSpacing: '3px' }}>
                                        ★ MEGA JACKPOT ★
                                    </span>
                                </motion.div>
                            </div>

                            {/* REELS */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                perspective: '1000px', position: 'relative', padding: '10px 0'
                            }}>
                                <Reel isSpinning={gameState === "spinning"} stopDelay={1200} finalSymbol={currentSymbols[0]} onStopped={handleReelStopped} />
                                <Reel isSpinning={gameState === "spinning"} stopDelay={1800} finalSymbol={currentSymbols[1]} onStopped={handleReelStopped} />
                                <Reel isSpinning={gameState === "spinning"} stopDelay={2400} finalSymbol={currentSymbols[2]} onStopped={handleReelStopped} />

                                {/* Payline */}
                                <div style={{
                                    position: 'absolute', left: '5%', right: '5%', top: '50%', height: '4px',
                                    background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
                                    boxShadow: '0 0 15px #fbbf24, 0 0 30px rgba(251, 191, 36, 0.5)',
                                    transform: 'translateY(-50%)'
                                }} />
                            </div>

                            {/* Status */}
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <span style={{ fontSize: '12px', color: 'rgba(251, 191, 36, 0.6)', fontFamily: 'monospace' }}>
                                    {gameState === 'spinning' ? '• • •' : `Попытка ${spinCount + 1} из ${WIN_ON_SPIN}`}
                                </span>
                            </div>

                            {/* Spots Left Urgency */}
                            {gameState === 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{
                                        textAlign: 'center', marginTop: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                    }}
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}
                                    />
                                    <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>
                                        Осталось мест: <span style={{ fontWeight: 800 }}>{spotsLeft}</span>
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        {/* SPIN BUTTON */}
                        {gameState === "idle" && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(251, 191, 36, 0.6)' }}
                                whileTap={{ scale: 0.98, y: 3 }}
                                onClick={handleSpin}
                                style={{
                                    width: '100%', marginTop: '16px', padding: '20px',
                                    borderRadius: '16px', border: 'none', cursor: 'pointer',
                                    background: 'linear-gradient(180deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)',
                                    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -3px 0 rgba(0,0,0,0.2), 0 4px 0 #b45309, 0 8px 30px rgba(251, 191, 36, 0.4)',
                                    fontSize: '20px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '3px',
                                    textShadow: '0 1px 0 rgba(255,255,255,0.4)',
                                    position: 'relative', overflow: 'hidden'
                                }}
                            >
                                {/* Shine */}
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                    style={{
                                        position: 'absolute', inset: 0, width: '40%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                                        transform: 'skewX(-15deg)'
                                    }}
                                />
                                <span style={{ position: 'relative', zIndex: 2 }}>🎰 КРУТИТЬ</span>
                            </motion.button>
                        )}

                        {/* Spinning State */}
                        {gameState === "spinning" && (
                            <div style={{ textAlign: 'center', padding: '24px' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                                    style={{
                                        display: 'inline-block', width: '32px', height: '32px',
                                        border: '3px solid #fbbf24', borderTopColor: 'transparent', borderRadius: '50%'
                                    }}
                                />
                                <p style={{ marginTop: '12px', fontWeight: 700, color: '#fbbf24', fontSize: '14px' }}>КРУТИМ...</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* === WON === */}
                {gameState === "won" && (
                    <motion.div
                        key="win"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <div style={{
                            borderRadius: '20px', padding: '24px', textAlign: 'center',
                            background: 'linear-gradient(180deg, #0a1628 0%, #050a14 100%)',
                            border: '3px solid',
                            borderImage: 'linear-gradient(180deg, #fbbf24 0%, #b45309 50%, #fbbf24 100%) 1',
                            boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), inset 0 0 40px rgba(0,0,0,0.5)',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            {/* Top Glow */}
                            <div style={{
                                position: 'absolute', top: 0, left: '20%', right: '20%', height: '3px',
                                background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
                                boxShadow: '0 0 20px #fbbf24'
                            }} />

                            {/* Trophy */}
                            <motion.div
                                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ fontSize: '64px', marginBottom: '16px' }}
                            >🏆</motion.div>

                            <h2 style={{
                                fontSize: '32px', fontWeight: 900, marginBottom: '8px',
                                color: '#fbbf24',
                                textShadow: '0 0 30px rgba(251, 191, 36, 0.6)'
                            }}>ДЖЕКПОТ!</h2>

                            <p style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>Доступ разблокирован</p>
                            <p style={{ fontSize: '14px', color: 'rgba(148, 163, 184, 0.8)', marginBottom: '20px' }}>
                                Бонус <span style={{ color: '#fbbf24', fontWeight: 700 }}>+500%</span> готов к активации
                            </p>

                            <PromoCode onCopy={handleCopyCode} copied={copied} />
                        </div>

                        {/* CTA Button - Pulsing */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: [1, 1.02, 1],
                                boxShadow: [
                                    'inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 0 #166534, 0 8px 30px rgba(34, 197, 94, 0.4)',
                                    'inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 0 #166534, 0 15px 50px rgba(34, 197, 94, 0.6)',
                                    'inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 0 #166534, 0 8px 30px rgba(34, 197, 94, 0.4)'
                                ]
                            }}
                            transition={{
                                delay: 0.2,
                                scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
                                boxShadow: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCTAClick}
                            style={{
                                width: '100%', marginTop: '16px', padding: '22px',
                                borderRadius: '16px', border: 'none', cursor: 'pointer',
                                background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                                boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 0 #166534, 0 8px 30px rgba(34, 197, 94, 0.4)',
                                fontSize: '17px', fontWeight: 900, color: 'white', letterSpacing: '1px',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                style={{
                                    position: 'absolute', inset: 0, width: '40%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                    transform: 'skewX(-15deg)'
                                }}
                            />
                            <span style={{ position: 'relative', zIndex: 2 }}>💰 ЗАБРАТЬ ВЫИГРЫШ НА 1WIN</span>
                        </motion.button>

                        {/* Trust */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            marginTop: '16px', fontSize: '11px', color: 'rgba(148, 163, 184, 0.7)'
                        }}>
                            <Clock size={12} color="#fbbf24" />
                            <span>Резерв:</span>
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
