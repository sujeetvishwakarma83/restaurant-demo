import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Clock, Calendar, ChefHat, Compass, Sparkles, ArrowRight, Wine } from 'lucide-react';
import { SIGNATURE_CREATIONS, HERO_IMAGE } from '../data';

interface FrontSeatProps {
  onNavigate: (section: string) => void;
}

export const FrontSeat: React.FC<FrontSeatProps> = ({ onNavigate }) => {
  const [activeCreation, setActiveCreation] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  // Scroll parallax configurations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 overflow-hidden">
      {/* Background Hero Zoom & Parallax (Fixed Cover Effect) */}
      <div className="absolute inset-0 z-0" style={{ clipPath: 'inset(0px)' }}>
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${HERO_IMAGE})`
          }}
        />
        <div className="fixed inset-0 bg-neutral-950/35" />
        
        {/* Subtle decorative grid */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(230,57,70,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(230,57,70,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div id="hero-content" className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        {/* Text Area */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left select-none">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" />
            Triple Michelin Starred
          </motion.div>

          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="text-gold-500 font-accent leading-none italic text-[36px] md:text-[46px]"
            >
              L’Art Gastronomique
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-white font-serif text-[48px] md:text-[64px] tracking-[-1px] leading-none uppercase font-bold"
            >
              L'ÉCLAT
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-neutral-350 font-sans text-[16px] md:text-[18px] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
          >
            Where pure culinary high-art aligns with exquisite sensory theater. Executive Chef Julian Vance presents a masterfully curated symphony of rare flavours, vintage grand crus, and bespoke dining salons in the heart of Paris.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <button 
              id="btn-nav-reservation"
              onClick={() => onNavigate('reservations')}
              className="px-8 py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-600 text-neutral-100 text-[16px] font-semibold uppercase tracking-wider rounded-none transition-all duration-300 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20 cursor-pointer font-sans"
            >
              Reserve a Table
            </button>
            <button 
              id="btn-nav-menu"
              onClick={() => onNavigate('menu')}
              className="px-8 py-4 bg-transparent border border-neutral-700 hover:border-gold-400 text-white hover:text-gold-400 text-[16px] font-semibold uppercase tracking-wider rounded-none transition-all duration-300 cursor-pointer font-sans"
            >
              Explore Degustation Menu
            </button>
          </motion.div>
        </div>

        {/* Dynamic Interactive Creation Carousel */}
        <div id="hero-carousel" className="lg:col-span-5 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="glass-card p-6 relative rounded-2xl border border-gold-500/10 overflow-hidden group"
          >
            <div className="relative h-64 overflow-hidden mb-6 rounded-2xl border border-neutral-850" style={{ perspective: 1000 }}>
              <AnimatePresence mode="wait">
                <motion.video 
                  key={activeCreation}
                  src={SIGNATURE_CREATIONS[activeCreation].videoUrl}
                  autoPlay
                  muted
                  playsInline
                  onEnded={() => {
                    setActiveCreation(prev => (prev + 1) % SIGNATURE_CREATIONS.length);
                  }}
                  className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
                  initial={{ opacity: 0, rotateY: 75, scale: 0.92, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, rotateY: -75, scale: 0.92, filter: 'blur(4px)' }}
                  transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                />
              </AnimatePresence>
              <div className="absolute top-4 left-4 bg-neutral-900/90 px-3 py-1 text-[10px] text-gold-600 uppercase tracking-widest border border-gold-500/20 font-accent italic">
                Chef's Masterpiece
              </div>
            </div>

            <div className="space-y-2 select-none">
              <span className="text-gold-500 font-accent italic text-sm tracking-wider">
                Creation 0{activeCreation + 1} of {SIGNATURE_CREATIONS.length}
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCreation}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-neutral-200 text-xl font-serif font-bold">
                    {SIGNATURE_CREATIONS[activeCreation].name}
                  </h3>
                  <p className="text-gold-500 font-accent italic text-sm mb-2">
                    {SIGNATURE_CREATIONS[activeCreation].frenchName}
                  </p>
                  <p className="text-neutral-550 text-xs leading-relaxed font-normal font-sans">
                    {SIGNATURE_CREATIONS[activeCreation].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-neutral-850">
              {SIGNATURE_CREATIONS.map((creation, idx) => {
                const isActive = activeCreation === idx;
                const thumbImage = idx === 0 
                  ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=150&auto=format&fit=crop" 
                  : idx === 1
                  ? "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=150&auto=format&fit=crop"
                  : "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=150&auto=format&fit=crop";
                
                return (
                  <button
                    key={creation.id}
                    id={`btn-carousel-card-${idx}`}
                    onClick={() => setActiveCreation(idx)}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'border-gold-500 bg-gold-500/[0.04] shadow-sm' 
                        : 'border-neutral-850 bg-neutral-900/40 hover:border-neutral-800 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden mb-1.5 border border-neutral-850">
                      <img 
                        src={thumbImage} 
                        alt={creation.name} 
                        className={`w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-105' : 'grayscale hover:grayscale-0'}`}
                      />
                    </div>
                    <span className={`text-[10px] uppercase font-sans tracking-wider text-center leading-tight truncate w-full ${isActive ? 'text-gold-500 font-semibold' : 'text-neutral-500 font-normal'}`}>
                      {creation.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Front Desk Info Panels */}
      <div id="front-desk-indicators" className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 md:mt-4">
        <div className="glass-card p-5 border border-gold-500/5 hover:border-gold-500/10 transition-all">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-gold-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-mono uppercase tracking-widest mb-1">Dine Salons</p>
              <h4 className="text-sm text-neutral-100 font-semibold font-serif">19:00 — 23:30</h4>
              <p className="text-[10px] text-neutral-500">Tuesday to Saturday</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-gold-500/5 hover:border-gold-500/10 transition-all">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-gold-400">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-mono uppercase tracking-widest mb-1">Chef de Cuisine</p>
              <h4 className="text-sm text-neutral-100 font-semibold font-serif">Julian Vance</h4>
              <p className="text-[10px] text-neutral-500">M.O.F Cuisine Lauréat</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-gold-500/5 hover:border-gold-500/10 transition-all">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-gold-400">
              <Wine className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-mono uppercase tracking-widest mb-1">Sommelier Selection</p>
              <h4 className="text-sm text-neutral-100 font-semibold font-serif">14,000+ Bottles</h4>
              <p className="text-[10px] text-neutral-500">Grand Cru Bordeaux & Burgundy</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-gold-500/5 hover:border-gold-500/10 transition-all">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-gold-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-mono uppercase tracking-widest mb-1">Location</p>
              <h4 className="text-sm text-neutral-100 font-semibold font-serif">Place des Vosges</h4>
              <p className="text-[10px] text-neutral-500">Le Marais, 75004 Paris</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
