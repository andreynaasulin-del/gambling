"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Clock } from "lucide-react";
import LuxurySlotMachine from "@/components/LuxurySlotMachine";
import { LanguageProvider, useLanguage, LanguageSwitcher } from "@/components/LanguageContext";

// Floating Particles (reduced for mobile perf)
const Particles = () => (
  <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, opacity: 0 }}
        animate={{
          y: [`${Math.random() * 100}%`, `${Math.random() * 100 - 30}%`],
          opacity: [0, 0.5, 0]
        }}
        transition={{ duration: 8 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 5 }}
        style={{
          position: 'absolute',
          width: `${2 + Math.random() * 3}px`,
          height: `${2 + Math.random() * 3}px`,
          borderRadius: '50%',
          background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#0ea5e9' : '#8b5cf6'
        }}
      />
    ))}
  </div>
);

function MainContent() {
  const { t } = useLanguage();
  const [onlineCount, setOnlineCount] = useState(0);
  const [feedIndex, setFeedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState({ minutes: 14, seconds: 59 });

  const LIVE_MESSAGES = [
    { user: "User_482", action: t('gotBonus'), icon: "🎰" },
    { user: "Player_129", action: t('activatedSpins'), icon: "🎁" },
    { user: "VIP_893", action: t('wonJackpot'), icon: "💰" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 500) + 1200);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setFeedIndex(i => (i + 1) % 3), 3000);
    return () => clearInterval(interval);
  }, []);

  // Countdown starts immediately (urgency from the start)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const feed = LIVE_MESSAGES[feedIndex];

  const cardStyle: React.CSSProperties = {
    background: 'rgba(13, 18, 30, 0.75)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
    boxShadow: `
      inset 0 0 0 1px rgba(255, 255, 255, 0.03),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      0 20px 40px -10px rgba(0, 0, 0, 0.8),
      0 0 20px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(0, 0, 0, 0.2)
    `,
    overflow: 'hidden',
    position: 'relative'
  };

  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      background: '#030712',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/bg-creative-opt.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat', opacity: 0.4, filter: 'blur(2px)'
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(3, 7, 18, 0.3) 0%, rgba(3, 7, 18, 0.7) 50%, rgba(3, 7, 18, 0.95) 100%)'
      }} />

      <Particles />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              width: '100%', maxWidth: '420px', zIndex: 10,
              background: '#0a101f', borderRadius: '24px',
              padding: '40px', textAlign: 'center'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{
                width: '50px', height: '50px', margin: '0 auto 20px',
                border: '3px solid rgba(59, 130, 246, 0.2)',
                borderTopColor: '#3b82f6', borderRadius: '50%'
              }}
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '14px' }}
            >
              {t('loading')}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ ...cardStyle, width: '100%', maxWidth: '420px', zIndex: 10 }}
          >
            {/* Animated Border Glow */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', top: '-1px', left: '-1px', right: '-1px', bottom: '-1px',
                borderRadius: '25px',
                background: 'conic-gradient(from 0deg, transparent, transparent 70%, rgba(59, 130, 246, 0.5), transparent 80%)',
                zIndex: -1
              }}
            />

            {/* Top Glow Line */}
            <div style={{
              position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px',
              background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
              boxShadow: '0 0 20px #3b82f6'
            }} />

            {/* Top Bar — Countdown + Online */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(0, 0, 0, 0.3)'
            }}>
              {/* Countdown Timer */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '11px', fontWeight: 700, color: '#ef4444',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                <Clock size={12} color="#ef4444" />
                <span>{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}</span>
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher />

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}
                />
                <span style={{ color: '#22c55e', fontWeight: 700 }}>{onlineCount}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>{t('online')}</span>
              </div>
            </div>

            {/* Header — Compact */}
            <div style={{ padding: '12px 16px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                {/* Logo */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <img src="/1win-logo.png" alt="1win" style={{ height: '28px', mixBlendMode: 'lighten' }} />
                </motion.div>

                {/* VIP Badge */}
                <motion.div
                  animate={{
                    boxShadow: ['0 0 15px rgba(59, 130, 246, 0.3)', '0 0 30px rgba(139, 92, 246, 0.6)', '0 0 15px rgba(59, 130, 246, 0.3)'],
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px', borderRadius: '50px',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    position: 'relative', overflow: 'hidden'
                  }}
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    style={{
                      position: 'absolute', top: 0, left: 0,
                      width: '50%', height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transform: 'skewX(-20deg)'
                    }}
                  />
                  <Shield size={12} color="#3b82f6" />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#3b82f6', letterSpacing: '1px', position: 'relative' }}>{t('vipAccess')}</span>
                </motion.div>
              </div>

              {/* Divider */}
              <div style={{
                height: '1px', margin: '0 0 12px',
                background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)',
              }} />

              {/* Title — Compact */}
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.2, marginBottom: '4px' }}>
                  <span style={{
                    background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>{t('tryLuck')}</span>
                  <br />
                  <span style={{
                    color: '#3b82f6',
                    textShadow: '0 0 40px rgba(59, 130, 246, 0.6)'
                  }}>{t('personalBonus')}</span>
                </h1>
                <p style={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '12px' }}>
                  {t('exclusiveAccess')}
                </p>
              </div>
            </div>

            {/* Slot Machine */}
            <div style={{ padding: '0 12px 12px' }}>
              <LuxurySlotMachine />
            </div>

            {/* Live Feed */}
            <div style={{ padding: '0 12px 12px' }}>
              <div style={{
                borderRadius: '10px', padding: '10px 14px',
                background: 'rgba(5, 7, 10, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }}
                  />
                  <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>LIVE</span>
                </div>
                <div style={{ width: '1px', height: '12px', background: 'rgba(255, 255, 255, 0.1)' }} />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={feedIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}
                  >
                    <span style={{ color: '#64748b' }}>{feed.user}:</span> {feed.action}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px 16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(0, 0, 0, 0.2)'
            }}>
              {[
                { icon: <Zap size={9} />, label: t('secure') },
                { icon: <Shield size={9} />, label: t('ssl') },
                { icon: null, label: '18+' }
              ].map((badge, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '4px 8px', borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}>
                  {badge.icon && <span style={{ color: '#3b82f6' }}>{badge.icon}</span>}
                  <span style={{ fontSize: '8px', fontWeight: 600, color: 'rgba(148, 163, 184, 0.8)', letterSpacing: '0.5px' }}>{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function OverrideXPreland() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}
