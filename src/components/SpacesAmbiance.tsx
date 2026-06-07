import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Utensils, Award, ShieldAlert, Heart, Flame } from 'lucide-react';
import { AMBIANCE_IMAGE, CELLAR_IMAGE, CHEFS_TABLE_IMAGE, PRIVATE_ENCLAVES_IMAGE } from '../data';

interface SpaceConfig {
  id: string;
  name: string;
  frenchName: string;
  imageUrl: string;
  lightingPreference: string;
  accentColor: string;
  soundPreset: string;
  capacity: string;
  dressCode: string;
  pairingTier: string;
  description: string;
}

const SPACES: SpaceConfig[] = [
  {
    id: 'hall',
    name: 'The Great Hall',
    frenchName: 'La Grande Salle',
    imageUrl: AMBIANCE_IMAGE,
    lightingPreference: 'Warm Amber & Candlelight',
    accentColor: '#e9c349',
    soundPreset: 'Subtle Classical Cello',
    capacity: '42 Guests Maximum',
    dressCode: 'Formal attire (jacket requested)',
    pairingTier: 'Standard Michelin Pairing Included',
    description: 'An expansive architectural masterpiece structured in dark minimalist pillars, golden accents, and warm low-level candlelight. The heartbeat of L\'Éclat, offering an unforgettable acoustic and sensory ambiance.'
  },
  {
    id: 'cellar',
    name: 'The Ancient Cellar',
    frenchName: 'La Crypte des Millésimes',
    imageUrl: CELLAR_IMAGE,
    lightingPreference: 'Low Somber Vault Luminance',
    accentColor: '#ca613c',
    soundPreset: 'Atmospheric Vault Reverb',
    capacity: '12 Guests Maximum',
    dressCode: 'Smart Casual / Elegant',
    pairingTier: 'Ultra Vintage Grand Cru flight',
    description: 'Steeped in history, our underground limestone vault houses over 14,000 vintage bottles. Diners eat wrapped in the fragrant silence of ancient oak casks, illuminated by bespoke fiber-optic starlight.'
  },
  {
    id: 'chef',
    name: "The Chef's Table",
    frenchName: 'La Table d\'Honneur Vance',
    imageUrl: CHEFS_TABLE_IMAGE,
    lightingPreference: 'Dynamic Culinary Spotlighting',
    accentColor: '#5fafe9',
    soundPreset: 'Kitchen Sizzle Symphony',
    capacity: '6 Guests Maximum',
    dressCode: 'Polished / Formal preferred',
    pairingTier: 'Chef\'s personal cellars curated',
    description: 'A front-row showcase to the sensory theater of a triple-starred brigade in complete synergy. Directly facing Chef Vance\'s immaculate open pass, this high-table experience delivers creations seconds from plating.'
  },
  {
    id: 'alcove',
    name: 'Private Enclaves',
    frenchName: 'Les Salons Confidentiels',
    imageUrl: PRIVATE_ENCLAVES_IMAGE,
    lightingPreference: 'Bespoke Twilight Glow (Adjustable)',
    accentColor: '#c55fe9',
    soundPreset: 'Acoustic dampening total silence',
    capacity: '2 to 8 Guests per Salon',
    dressCode: 'Exclusive Formal (Mandatory)',
    pairingTier: 'Prestige Reserve selection access',
    description: 'Immense private dining suites shielded by soundproof velvet curtains and velvet partitions. Designed for discrete banqueting, luxury talks, and custom requests. Equipped with customizable multi-color dimmable orbs.'
  }
];

export const SpacesAmbiance: React.FC = () => {
  const [activeSpaceId, setActiveSpaceId] = useState<string>('hall');
  const [lightIntensity, setLightIntensity] = useState<number>(50);

  const activeSpace = SPACES.find(s => s.id === activeSpaceId) || SPACES[0];

  return (
    <div id="spaces-ambiance-view" className="relative min-h-screen py-24 select-none">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.35em] block mb-3">Les Salons d'Exception</span>
          <h2 className="text-white font-serif text-3xl md:text-5xl font-medium tracking-tight mb-4">Luxury Dining Spaces</h2>
          <p className="text-neutral-400 font-sans text-sm font-light leading-relaxed">
            Customize and explore our specialized dining enclaves, designed to calibrate acoustic, thermal, and visual properties to coordinate with your party's desires.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* L’Éclat Spaces Nav Card */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest pl-1">Salons Index</span>
              <div className="space-y-2.5">
                {SPACES.map(space => {
                  const isActive = space.id === activeSpaceId;
                  return (
                    <button
                      key={space.id}
                      id={`btn-space-${space.id}`}
                      onClick={() => setActiveSpaceId(space.id)}
                      className={`w-full text-left p-5 flex items-center justify-between border transition-all rounded-none cursor-pointer ${
                        isActive
                          ? 'border-gold-500/40 bg-gold-500/5'
                          : 'border-neutral-900 bg-neutral-900/10 hover:bg-neutral-900/30'
                      }`}
                    >
                      <div>
                        <h3 className={`text-sm font-medium font-serif ${isActive ? 'text-gold-400' : 'text-neutral-200'}`}>
                          {space.name}
                        </h3>
                        <p className="text-[10px] text-neutral-500 font-mono lowercase">{space.frenchName}</p>
                      </div>
                      <div 
                        className="w-3.5 h-3.5 border border-neutral-700 rounded-full flex items-center justify-center p-0.5"
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="active-space-pip"
                            className="w-full h-full rounded-full" 
                            style={{ backgroundColor: space.accentColor }} 
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Live Ambient Calibration Panel */}
            <div className="glass-card p-5 border border-gold-500/5 space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white font-mono uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-gold-400" />
                  Glow Calibrators
                </span>
                <span className="text-[10px] text-gold-400 font-mono italic">{activeSpace.lightingPreference}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                  <span>Chandelier Lumens</span>
                  <span>{lightIntensity}%</span>
                </div>
                <input
                  id="range-lumens"
                  type="range"
                  min="10"
                  max="100"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                  className="w-full accent-gold-500 h-1 bg-neutral-800 rounded"
                />
              </div>

              <div className="pt-2 border-t border-neutral-900 flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                <span>Sound Signature:</span>
                <span className="text-white">{activeSpace.soundPreset}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Graphic Stage view */}
          <div className="lg:col-span-8 flex flex-col justify-between glass-card border border-gold-500/10 overflow-hidden relative min-h-[480px]">
            
            {/* Ambient Background with adjustable opacity/lighting from calibrator */}
            <div className="absolute inset-0 z-0 bg-neutral-950">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeSpaceId}
                  src={activeSpace.imageUrl}
                  alt={activeSpace.name}
                  className="w-full h-full object-cover transition-opacity duration-1000 select-none pointer-events-none"
                  style={{ 
                    opacity: (lightIntensity / 140) + 0.2, 
                    filter: `brightness(${(lightIntensity/100) + 0.3}) contrast(1.05) saturate(0.85)`
                  }}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: (lightIntensity / 140) + 0.2, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
            </div>

            {/* Inner Top Elements */}
            <div className="relative z-10 p-6 md:p-8 flex justify-between items-center">
              <div 
                className="px-3 py-1 bg-neutral-950/90 text-[10px] font-mono border uppercase tracking-widest"
                style={{ borderColor: `${activeSpace.accentColor}30`, color: activeSpace.accentColor }}
              >
                {activeSpace.lightingPreference}
              </div>
              <div className="flex gap-2">
                <span className="p-1.5 bg-neutral-950/80 text-gold-400 border border-gold-500/10">
                  <Award className="w-4 h-4" />
                </span>
                <span className="p-1.5 bg-neutral-950/80 text-gold-400 border border-gold-500/10">
                  <Utensils className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Floor details */}
            <div className="relative z-10 p-6 md:p-8 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-neutral-950/40 border-t border-neutral-900/60 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-white font-serif text-2xl font-medium tracking-tight">
                    {activeSpace.name}
                  </h3>
                  <p className="text-gold-500 text-xs italic font-serif leading-none mt-1">
                    {activeSpace.frenchName}
                  </p>
                </div>
                <div 
                  className="w-4 h-4 rounded-full shadow-lg"
                  style={{ 
                    backgroundColor: activeSpace.accentColor, 
                    boxShadow: `0 0 16px ${activeSpace.accentColor}` 
                  }} 
                />
              </div>

              <p className="text-neutral-400 text-xs leading-relaxed max-w-2xl font-light">
                {activeSpace.description}
              </p>

              {/* Stats panel in space floor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-900">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest block">Reserve Capacity:</span>
                  <span className="text-xs text-neutral-200 font-semibold font-serif">{activeSpace.capacity}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest block">Dress Standard:</span>
                  <span className="text-xs text-neutral-200 font-semibold font-serif">{activeSpace.dressCode}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest block">Wine Flight:</span>
                  <span className="text-xs text-neutral-200 font-semibold font-serif">{activeSpace.pairingTier}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
