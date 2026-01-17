"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Lock } from "lucide-react";
import LuxurySlotMachine from "@/components/LuxurySlotMachine";
import { LanguageProvider, LanguageSwitcher, useLanguage } from "@/components/LanguageContext";

// Floating Particles
const Particles = () => (
  <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    {[...Array(40)].map((_, i) => (
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

// Wrapper component with Language Provider
export default function OverrideXPrelandWrapper() {
  return (
    <LanguageProvider>
      <OverrideXPreland />
    </LanguageProvider>
  );
}

function OverrideXPreland() {
  const { t } = useLanguage();
  const [sessionId, setSessionId] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [feedIndex, setFeedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const LIVE_MESSAGES = [
    { user: "User_482", action: t('gotBonus'), icon: "🎰" },
    { user: "Player_129", action: t('activatedSpins'), icon: "🎁" },
    { user: "VIP_893", action: t('wonJackpot'), icon: "💰" },
  ];

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const chars = '0123456789ABCDEF';
    let id = '';
    for (let i = 0; i < 8; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    setSessionId(id);
    setOnlineCount(Math.floor(Math.random() * 500) + 1200);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setFeedIndex(i => (i + 1) % 3), 3000);
    return () => clearInterval(interval);
  }, []);

  const feed = LIVE_MESSAGES[feedIndex];

  const cardStyle: React.CSSProperties = {
    // Glassmorphism 2.0 - Heavy Glass
    background: 'rgba(13, 18, 30, 0.75)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    borderRadius: '24px',

    // Titanium Border (1px metallic gradient)
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.4)',

    // Deep Layered Shadows (Floating Effect)
    boxShadow: `
      inset 0 0 0 1px rgba(255, 255, 255, 0.03), /* Inner edge definition */
      inset 0 1px 0 rgba(255, 255, 255, 0.15),   /* Top inner highlight */
      0 20px 40px -10px rgba(0, 0, 0, 0.8),      /* Deep drop shadow */
      0 0 20px rgba(0, 0, 0, 0.5),               /* Ambient soft shadow */
      0 0 0 1px rgba(0, 0, 0, 0.2)               /* Outer dark rim */
    `,

    overflow: 'hidden',
    position: 'relative'
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: '#030712',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Creative Image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/bg-creative-opt.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        opacity: 0.4,
        filter: 'blur(2px)'
      }} />

      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(3, 7, 18, 0.3) 0%, rgba(3, 7, 18, 0.7) 50%, rgba(3, 7, 18, 0.95) 100%)'
      }} />

      <Particles />

      <AnimatePresence mode="wait">
        {isLoading ? (
          /* Loading Skeleton */
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
                borderTopColor: '#3b82f6',
                borderRadius: '50%'
              }}
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '14px' }}
            >
              Загрузка VIP доступа...
            </motion.div>
          </motion.div>
        ) : (
          /* Main Card */
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

            {/* Top Bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)',
                padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <Lock size={10} />
                <span>ENCRYPTED SESSION: {sessionId.substring(0, 8)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <LanguageSwitcher />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}
                  />
                  <span style={{ color: '#22c55e', fontWeight: 700 }}>{onlineCount}</span>
                  <span style={{ color: 'rgba(148, 163, 184, 0.7)' }}>{t('online')}</span>
                </div>
              </div>
            </div>

            {/* Header */}
            <div style={{ padding: '24px 24px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                {/* Logo - 1win with blend mode to hide dark bg */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <img
                    src="/1win-logo.png"
                    alt="1win"
                    style={{
                      height: '38px',
                      mixBlendMode: 'lighten'
                    }}
                  />
                </motion.div>

                {/* VIP Badge */}
                <motion.div
                  animate={{
                    boxShadow: ['0 0 15px rgba(59, 130, 246, 0.3)', '0 0 30px rgba(139, 92, 246, 0.6)', '0 0 15px rgba(59, 130, 246, 0.3)'],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 18px', borderRadius: '50px',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Shimmer effect */}
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
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Shield size={14} color="#3b82f6" />
                  </motion.div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', letterSpacing: '1px', position: 'relative' }}>{t('vipAccess')}</span>
                </motion.div>
              </div>

              {/* Glowing Divider */}
              <div style={{
                height: '1px', margin: '0 0 20px',
                background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)'
              }} />

              {/* Title */}
              <div style={{ textAlign: 'center' }}>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.2, marginBottom: '8px' }}
                >
                  <span style={{
                    background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>{t('tryLuck')}</span>
                  <br />
                  <span style={{
                    color: '#3b82f6',
                    textShadow: '0 0 40px rgba(59, 130, 246, 0.6)'
                  }}>{t('personalBonus')}</span>
                </motion.h1>
                <p style={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '13px' }}>
                  {t('exclusiveAccess')}
                </p>
              </div>
            </div>

            {/* Slot Machine */}
            <div style={{ padding: '0 16px 16px' }}>
              <LuxurySlotMachine />
            </div>

            {/* Live Feed */}
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{
                borderRadius: '12px', padding: '12px 16px',
                background: 'rgba(5, 7, 10, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}
                  />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>LIVE</span>
                </div>

                <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.1)' }} />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={feedIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    <span style={{ color: '#64748b' }}>{feed.user}:</span> {feed.action}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '16px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(0, 0, 0, 0.2)'
            }}>
              {[
                { icon: <Zap size={10} />, label: t('secure') },
                { icon: <Shield size={10} />, label: t('ssl') },
                { icon: null, label: '18+' }
              ].map((badge, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 10px', borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}>
                  {badge.icon && <span style={{ color: '#3b82f6' }}>{badge.icon}</span>}
                  <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(148, 163, 184, 0.8)', letterSpacing: '0.5px' }}>{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
