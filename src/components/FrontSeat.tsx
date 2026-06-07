import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Calendar, ChefHat, Compass, Sparkles, ArrowRight, Wine } from 'lucide-react';
import { SIGNATURE_CREATIONS, HERO_IMAGE } from '../data';

interface FrontSeatProps {
  onNavigate: (section: string) => void;
}

export const FrontSeat: React.FC<FrontSeatProps> = ({ onNavigate }) => {
  const [activeCreation, setActiveCreation] = useState(0);

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 overflow-hidden">
      {/* Background Hero Zoom */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[10s] ease-out"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[2px]" />
        
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(242,202,80,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(242,202,80,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
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
              className="text-amber-50 font-serif leading-none italic font-normal text-3xl md:text-4xl"
            >
              L’Art Gastronomique
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-white font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none uppercase font-bold"
            >
              L'ÉCLAT
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-neutral-300 font-sans text-sm md:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
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
              className="px-8 py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-600 text-neutral-950 text-xs font-semibold uppercase tracking-widest rounded-none transition-all duration-300 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20 cursor-pointer"
            >
              Reserve a Table
            </button>
            <button 
              id="btn-nav-menu"
              onClick={() => onNavigate('menu')}
              className="px-8 py-4 bg-transparent border border-neutral-700 hover:border-gold-400 text-white hover:text-gold-400 text-xs font-semibold uppercase tracking-widest rounded-none transition-all duration-300 cursor-pointer"
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
            className="glass-card p-6 relative rounded-none border border-gold-500/10 overflow-hidden group"
          >
            <div className="relative h-64 overflow-hidden mb-6 border border-neutral-800">
              <AnimatePresence mode="wait">
                <motion.video 
                  key={activeCreation}
                  src={SIGNATURE_CREATIONS[activeCreation].videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              <div className="absolute top-3 left-3 bg-neutral-950/80 px-2 py-1 text-[10px] text-gold-400 uppercase tracking-widest border border-gold-500/20 font-mono">
                Chef's Masterpiece
              </div>
            </div>

            <div className="space-y-2 select-none">
              <span className="text-gold-400 font-mono text-xs uppercase tracking-widest">
                Creations {activeCreation + 1} of {SIGNATURE_CREATIONS.length}
              </span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCreation}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white text-xl font-serif font-semibold">
                    {SIGNATURE_CREATIONS[activeCreation].name}
                  </h3>
                  <p className="text-gold-500/70 text-xs italic font-serif mb-2">
                    {SIGNATURE_CREATIONS[activeCreation].frenchName}
                  </p>
                  <p className="text-neutral-400 text-xs leading-relaxed font-light font-sans">
                    {SIGNATURE_CREATIONS[activeCreation].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-900">
              <div className="flex gap-1.5">
                {SIGNATURE_CREATIONS.map((_, idx) => (
                  <button
                    key={idx}
                    id={`btn-carousel-dot-${idx}`}
                    onClick={() => setActiveCreation(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${activeCreation === idx ? 'bg-gold-400 w-5' : 'bg-neutral-700 hover:bg-neutral-500'}`}
                  />
                ))}
              </div>
              <button
                id="btn-carousel-next"
                onClick={() => setActiveCreation((prev) => (prev + 1) % SIGNATURE_CREATIONS.length)}
                className="text-xs text-gold-400 hover:text-white uppercase tracking-widest font-mono flex items-center gap-1 group/btn cursor-pointer"
              >
                Next Creation
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
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
