import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Utensils, Award, Flame, Users, ShieldCheck, Music, Wine, Calendar, ChevronRight } from 'lucide-react';
import { AMBIANCE_IMAGE, CELLAR_IMAGE, CHEFS_TABLE_IMAGE, PRIVATE_ENCLAVES_IMAGE } from '../data';

interface SpacesAmbianceProps {
  onNavigate?: (section: string) => void;
}

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
    accentColor: '#b91c1c', /* Dark Red */
    soundPreset: 'Subtle Classical Cello',
    capacity: '42 Guests Maximum',
    dressCode: 'Formal attire (jacket requested)',
    pairingTier: 'Standard Michelin Pairing',
    description: 'An expansive architectural masterpiece structured in dark minimalist pillars, golden accents, and warm low-level candlelight. The heartbeat of L\'Éclat, offering an unforgettable acoustic and sensory ambiance.'
  },
  {
    id: 'cellar',
    name: 'The Ancient Cellar',
    frenchName: 'La Crypte des Millésimes',
    imageUrl: CELLAR_IMAGE,
    lightingPreference: 'Low Somber Vault Luminance',
    accentColor: '#c2410c', /* Dark Orange */
    soundPreset: 'Atmospheric Vault Reverb',
    capacity: '12 Guests Maximum',
    dressCode: 'Smart Casual / Elegant',
    pairingTier: 'Vintage Grand Cru flight',
    description: 'Steeped in history, our underground limestone vault houses over 14,000 vintage bottles. Diners eat wrapped in the fragrant silence of ancient oak casks, illuminated by bespoke fiber-optic starlight.'
  },
  {
    id: 'chef',
    name: "The Chef's Table",
    frenchName: 'La Table d\'Honneur Vance',
    imageUrl: CHEFS_TABLE_IMAGE,
    lightingPreference: 'Dynamic Culinary Spotlighting',
    accentColor: '#1d4ed8', /* Dark Blue */
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
    lightingPreference: 'Bespoke Twilight Glow',
    accentColor: '#7e22ce', /* Dark Purple */
    soundPreset: 'Total Acoustic Silence',
    capacity: '2 to 8 Guests per Salon',
    dressCode: 'Exclusive Formal (Mandatory)',
    pairingTier: 'Prestige Reserve selection access',
    description: 'Immense private dining suites shielded by soundproof velvet curtains and velvet partitions. Designed for discrete banqueting, luxury talks, and custom requests. Equipped with customizable multi-color dimmable orbs.'
  }
];

export const SpacesAmbiance: React.FC<SpacesAmbianceProps> = ({ onNavigate }) => {
  const [activeSpaceId, setActiveSpaceId] = useState<string>('hall');
  const [lightIntensity, setLightIntensity] = useState<number>(50);
  const [soundVolume, setSoundVolume] = useState<number>(60);

  const activeSpace = SPACES.find(s => s.id === activeSpaceId) || SPACES[0];

  return (
    <div id="spaces-ambiance-view" className="relative min-h-screen py-24 select-none">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold-500 font-serif text-[13px] uppercase tracking-[0.35em] block mb-3 font-semibold">Les Salons d'Exception</span>
          <h2 className="text-neutral-200 font-serif text-[36px] md:text-[46px] font-bold tracking-tight mb-4 leading-none">Luxury Dining Spaces</h2>
          <p className="text-neutral-500 font-sans text-[16px] md:text-[18px] font-normal leading-relaxed">
            Customize and explore our specialized dining enclaves, designed to calibrate acoustic, thermal, and visual properties to coordinate with your party's desires.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Navigation & Calibrator Column */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-widest pl-1">Salons Index</span>
              <div className="space-y-3">
                {SPACES.map(space => {
                  const isActive = space.id === activeSpaceId;
                  return (
                    <button
                      key={space.id}
                      id={`btn-space-${space.id}`}
                      onClick={() => setActiveSpaceId(space.id)}
                      className={`w-full text-left p-4.5 flex items-center justify-between border transition-all rounded-2xl cursor-pointer shadow-sm hover:scale-[1.01] ${
                        isActive
                          ? 'border-gold-500 bg-gold-500/[0.04]'
                          : 'border-neutral-850 bg-neutral-950 hover:border-neutral-500/30'
                      }`}
                    >
                      <div className="space-y-1">
                        <h3 className={`text-sm font-semibold font-serif transition-colors ${isActive ? 'text-gold-500' : 'text-neutral-200'}`}>
                          {space.name}
                        </h3>
                        <p className="text-[10px] text-neutral-500 font-sans font-medium uppercase tracking-wider">{space.frenchName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-sans font-semibold px-2 py-0.5 bg-neutral-900 text-neutral-500 rounded-full">
                          {space.id === 'hall' ? '42 Guests' : space.id === 'cellar' ? '12 Guests' : space.id === 'chef' ? '6 Guests' : '2-8 Guests'}
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-gold-500 translate-x-0.5' : 'text-neutral-400'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Environmental Control Panel */}
            <div className="glass-card p-6 border border-neutral-850 space-y-5 rounded-2xl bg-neutral-950 shadow-md">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <span className="text-[11px] text-neutral-200 font-serif font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-gold-500" />
                  Salon Calibrator
                </span>
                <span className="text-[9px] bg-gold-500/10 text-gold-600 px-2.5 py-0.5 rounded-full font-sans font-semibold uppercase tracking-wider">
                  Active
                </span>
              </div>

              {/* Lighting Slider */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">Luminance Glow</span>
                  <span className="text-gold-500 font-mono">{lightIntensity}%</span>
                </div>
                <input
                  id="range-lumens"
                  type="range"
                  min="20"
                  max="100"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                  className="w-full accent-gold-500 h-1.5 bg-neutral-900 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-neutral-455 font-sans italic">
                  <span>Soft Vault</span>
                  <span>{activeSpace.lightingPreference}</span>
                  <span>Full Focus</span>
                </div>
              </div>

              {/* Sound Volume Slider */}
              <div className="space-y-2.5 pt-2 border-t border-neutral-900">
                <div className="flex justify-between text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">Acoustic Symphony</span>
                  <span className="text-gold-500 font-mono">{soundVolume}%</span>
                </div>
                <input
                  id="range-volume"
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(Number(e.target.value))}
                  className="w-full accent-gold-500 h-1.5 bg-neutral-900 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-neutral-455 font-sans italic">
                  <span>Mute</span>
                  <span className="text-neutral-200 font-sans font-medium not-italic">{activeSpace.soundPreset}</span>
                  <span>Max Concert</span>
                </div>
              </div>
            </div>
          </div>

          {/* Viewport Stage Column */}
          <div className="lg:col-span-8 flex flex-col justify-between glass-card border border-neutral-850 overflow-hidden relative min-h-[500px] rounded-2xl bg-neutral-950 shadow-md">
            
            {/* Ambient Background with adjustable opacity/lighting from calibrator */}
            <div className="absolute inset-0 z-0 bg-neutral-950">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeSpaceId}
                  src={activeSpace.imageUrl}
                  alt={activeSpace.name}
                  className="w-full h-full object-cover transition-opacity duration-1000 select-none pointer-events-none"
                  style={{ 
                    opacity: (lightIntensity / 150) + 0.25, 
                    filter: `brightness(${(lightIntensity/100) + 0.25}) contrast(1.05) saturate(0.9)`
                  }}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: (lightIntensity / 150) + 0.25, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
            </div>

            {/* Viewport Header overlay */}
            <div className="relative z-10 p-6 md:p-8 flex justify-between items-center">
              <div 
                className="px-3.5 py-1 bg-neutral-950/90 text-[10px] font-sans font-semibold border rounded-full uppercase tracking-wider select-none"
                style={{ borderColor: `${activeSpace.accentColor}30`, color: activeSpace.accentColor }}
              >
                Ambient: {activeSpace.lightingPreference}
              </div>
              <div className="flex gap-2">
                <span className="p-2 bg-neutral-950/90 text-gold-500 border border-neutral-850 rounded-lg shadow-sm">
                  <Award className="w-4 h-4" />
                </span>
                <span className="p-2 bg-neutral-950/90 text-gold-500 border border-neutral-850 rounded-lg shadow-sm">
                  <Utensils className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Viewport Info Floor panel */}
            <div className="relative z-10 p-6 md:p-8 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-neutral-950/50 border-t border-neutral-850 space-y-5">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-neutral-200 font-serif text-2xl md:text-3xl font-bold tracking-tight">
                    {activeSpace.name}
                  </h3>
                  <p className="text-gold-500 text-sm font-serif italic leading-none">
                    {activeSpace.frenchName}
                  </p>
                </div>
                <div 
                  className="w-4.5 h-4.5 rounded-full shadow-lg border-2 border-neutral-950 mt-1.5"
                  style={{ 
                    backgroundColor: activeSpace.accentColor, 
                    boxShadow: `0 0 16px ${activeSpace.accentColor}` 
                  }} 
                />
              </div>

              <p className="text-neutral-500 text-sm md:text-[15px] leading-relaxed max-w-2xl font-normal">
                {activeSpace.description}
              </p>

              {/* Stats panel - 3 Columns with Icons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 border-t border-neutral-900/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-900 border border-neutral-850 text-gold-500 rounded-lg">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block leading-none mb-1">Capacity</span>
                    <span className="text-xs text-neutral-200 font-bold font-serif leading-none">{activeSpace.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-900 border border-neutral-850 text-gold-500 rounded-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block leading-none mb-1">Dress Code</span>
                    <span className="text-xs text-neutral-200 font-bold font-serif leading-none truncate block max-w-[150px]" title={activeSpace.dressCode}>{activeSpace.dressCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-900 border border-neutral-850 text-gold-500 rounded-lg">
                    <Wine className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block leading-none mb-1">Pairing Tier</span>
                    <span className="text-xs text-neutral-200 font-bold font-serif leading-none truncate block max-w-[150px]" title={activeSpace.pairingTier}>{activeSpace.pairingTier}</span>
                  </div>
                </div>
              </div>

              {/* Booking CTA Button Inside Details */}
              {onNavigate && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onNavigate('reservations')}
                    className="px-6 py-3 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-600 text-neutral-100 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2 rounded-full"
                  >
                    <Calendar className="w-3.5 h-3.5 text-neutral-100" />
                    Reserve This Salon
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
