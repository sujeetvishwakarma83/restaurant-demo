import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, X, Heart, Eye } from 'lucide-react';
import { GALLERY_ITEMS, CHEF_PORTRAIT_1, CHEF_PORTRAIT_2 } from '../data';
import { GalleryItem } from '../types';

const COMPOSITIONS = [
  {
    id: 'comp1',
    title: 'Summer Flora',
    subtitle: 'L\'Inflorescence d\'Été',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKOr3BTFwuvTJdCe4ZIyoefYf_QV1-lN85-T6XNtyFvM2OtRSX6J47oQuPgU7oim_FdIi-Ed8NxjjUf4va8WdQ3YaSxuxCInpIgZtuQchWtjOZa1UuNIzHLbUaeQxOAri-83XEHa9pxx5Xcqdf36tEYy45TpPbkI-jN6qSlv0pLiSP67rKWd6Hmx6CYZoEdeE9QBBJHqfQSEZVhwzsG1RbCLzkMArZo1NpR8IDjUgL3Q05Wa954W0GjNvM2ie-BtT6s77-i3yc35RJ',
    geometry: 'Concentric ring dispersion around a central focus sphere',
    elements: [
      { name: 'Base Element', value: 'White chocolate snow infused with organic lavender' },
      { name: 'Emulsion & Gels', value: 'Heirloom rosehip gel and blood orange micro-droplets' },
      { name: 'Botanical Garnish', value: 'Hand-harvested cornflowers, fresh micro-marigolds, and crystallization of pansy' },
      { name: 'Sensory Note', value: 'High sweet floral perfume balanced strictly with sharp citric acidity' }
    ]
  },
  {
    id: 'comp2',
    title: 'Ocean\'s Gift',
    subtitle: 'L\'Écrin Maritime',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc5fyRMrYVUYPlpAClSXLFBwm931JuhKxtV-6J7QYB_V8zmwXTHlyzeeKdg5v4bgeyB8iiXbBq47fA9SHvLrw4d6-jhAP4dJu8wNsE7n04jnCnB9tpqS-LcZlrln9cGTUPHt7O_jjzRrjM5SsVPtklsGna1tK12p1UnRv9jnb3NTMV1zdePYCpz8XcfEKn1vsxPMeV5bWbcczLfxUmCY5mGq_HrB_996dlGzlCe3XksHRTh1sOuuKWVKfbIazSidquJxsmxHAUiSsi',
    geometry: 'Ascending scale layout resting on clean crushed botanical ice',
    elements: [
      { name: 'Core Seafood', value: 'Brittany langoustines and raw sashimi-grade scallops' },
      { name: 'Chilled Bedding', value: 'Crushed marine ice infused with dill water and kelp salt' },
      { name: 'Acidic Accent', value: 'Preserved finger lime wedges supplying high pressure pops' },
      { name: 'Sensory Note', value: 'Pure cold salinity transitioning into subtle ocean sweetness' }
    ]
  },
  {
    id: 'comp3',
    title: 'Ethereal Elixir',
    subtitle: 'L\'Émanation Fumante',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj42FTbR1oywo0HX-cXntuiRlpohKod3eskD8g43eU4x5-92s0GC_5WVMfXtlEOrHzEaUDvflY1uHh6RYiwMzB0DyVrpAM17exno6mz-T12j5ddOpBA9mQVOm-1MjTLfW3mMzx8n89luqfHye1n8TC41rBYQ1N_ptfB4UHkgb1QeDXqa61ye_uk4jADN2T3Ff-0peSBqKWW89cIlvzexK7vhZxqLHothkR0-b8gIvdLWaQdHI27W6ud7Kf3Kr0tyfFv0z336nfgFRV',
    geometry: 'Floating vapour cascade with crystal symmetry glass orientation',
    elements: [
      { name: 'Vapour Carrier', value: 'Dry ice sublimating sweet cedarwood smoke' },
      { name: 'Liquid Core', value: 'Aged French cognac blended with house-pressed plum syrup' },
      { name: 'Aromatic Wash', value: 'Anise star mist applied directly to glass rim and surroundings' },
      { name: 'Sensory Note', value: 'Warm deep caramel tones enveloped in a cool, smoky forest top-note' }
    ]
  }
];

export const ChefCanvas: React.FC = () => {
  const [activeTab, setActiveTab ] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = ['all', 'plated', 'interior', 'crafted', 'kitchen', 'maritime'];

  const filteredItems = activeTab === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  return (
    <div id="chef-canvas-view" className="relative min-h-screen py-24 select-none">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.35em] block mb-3">La Toile du Chef Vance</span>
          <h2 className="text-white font-serif text-[32px] md:text-[40px] font-semibold tracking-tight mb-4">The Culinary Canvas</h2>
          <p className="text-neutral-450 font-sans text-[16px] md:text-[18px] font-normal leading-relaxed">
            A visual documentation of high-gastronomy creations, architectural dining spaces, and the synchronized kinetic energy of the hot kitchen line.
          </p>
        </div>

        {/* Narrative Chef Bio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20 bg-neutral-900/10 p-6 md:p-8 border border-gold-500/5">
          <div className="lg:col-span-5 relative h-96 overflow-hidden bg-neutral-950 border border-neutral-850">
            <img 
              src={CHEF_PORTRAIT_1} 
              alt="Chef Julien Vance in uniform" 
              className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:scale-103 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
            <div className="absolute bottom-6 left-6 space-y-0.5">
              <span className="text-[10px] text-gold-400 font-mono uppercase tracking-widest block">Executive Chef</span>
              <h3 className="text-white font-serif text-xl font-bold">Julien Vance</h3>
              <p className="text-neutral-500 text-[10px] uppercase font-mono">Meilleur Ouvrier de France</p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/5 border border-gold-500/10 text-gold-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Gastronomic Mission
            </div>
            
            <h3 className="text-white font-serif text-2xl md:text-3xl leading-snug">"Gastronomy is a fleeting sculpture, designed to evaporate into pure human memories."</h3>
            
            <p className="text-neutral-455 text-[16px] md:text-[18px] font-sans leading-relaxed font-normal">
              Chef de Cuisine Julien Vance directs L’Éclat with absolute mathematical precision and romantic flair. After training in legendary Châteaux throughout Loire and Lyon, Julien spent a decade perfecting molecular geometry and flavour extractions. Under his baton, every garnish, droplet of emulsion, and crystal of fleur de sel is calibrated to balance raw marine salinity, botanical acidity, and rich game savouriness.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs font-sans font-light">
              <div className="p-4 bg-neutral-950 border border-neutral-900 space-y-1">
                <span className="text-gold-400 font-mono font-semibold">98.5% Sourced Organic</span>
                <p className="text-neutral-500 text-[10px]">Sourced directly from heirloom bio farmlands in Normandy and Le Marais.</p>
              </div>
              <div className="p-4 bg-neutral-950 border border-neutral-900 space-y-1">
                <span className="text-gold-400 font-mono font-semibold">Zero Preservatives</span>
                <p className="text-neutral-500 text-[10px]">All vinegars, natural stocks, and ferments prepared in-house.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Selectors Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              id={`btn-gallery-cat-${cat}`}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
                activeTab === cat
                  ? 'border-gold-500 bg-gold-500/5 text-gold-400 font-bold'
                  : 'border-neutral-900 bg-neutral-900/10 text-neutral-400 hover:border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layoutId={`card-${item.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="group relative h-72 bg-neutral-950 overflow-hidden border border-gold-500/5 hover:border-gold-500/20 transition-all cursor-pointer"
                onClick={() => setSelectedPhoto(item)}
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-103 transition-all duration-[1s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />
                
                {/* Overlay actions on hover */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-neutral-950/60 backdrop-blur-[1px]">
                  <span className="text-[9px] text-gold-400 font-mono uppercase tracking-widest bg-neutral-950/95 px-2.5 py-1.5 border border-gold-500/15 w-fit">
                    {item.category} Plate Series
                  </span>
                  <div>
                    <h4 className="text-white font-serif text-lg font-bold">{item.title}</h4>
                    <span className="text-gold-500/80 text-[10px] font-mono flex items-center gap-1.5 mt-1">
                      <Eye className="w-3.5 h-3.5" /> High-Res Zoom Inside
                    </span>
                  </div>
                </div>

                {/* Subtle static label */}
                <div className="absolute bottom-5 left-5 right-5 flex justify-between items-baseline group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                  <h4 className="text-neutral-200 font-serif text-base">{item.title}</h4>
                  <span className="text-neutral-500 font-mono text-[9px] uppercase">{item.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Deconstructed Plate Compositions (Scroll-Triggered Reveal) */}
        <div id="deconstructed-compositions-section" className="mt-32 pt-20 border-t border-neutral-900">
          <div className="text-center max-w-xl mx-auto mb-20">
            <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.35em] block mb-2">Les Secrets de l'Assiette</span>
            <h3 className="text-white font-serif text-2xl md:text-4xl font-normal italic">Plated Geometry & Blueprints</h3>
            <p className="text-neutral-500 font-sans text-xs font-light leading-relaxed mt-2">
              Scroll down to witness Chef Julien’s meticulously calibrated ingredient layers and sensory architectures as they are revealed piece-by-piece.
            </p>
          </div>

          <div className="space-y-28">
            {COMPOSITIONS.map((comp, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={comp.id} 
                  id={`comp-row-${comp.id}`}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Glass-Bordered Image Panel with Scroll Trigger */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40, scale: 0.98 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full lg:w-1/2 relative h-80 sm:h-96 bg-neutral-950 overflow-hidden border border-gold-500/10 group grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
                  >
                    <img 
                      src={comp.image} 
                      alt={comp.title} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/20" />
                    <div className="absolute bottom-5 left-5 bg-neutral-950/80 px-4 py-2 border border-gold-500/15">
                      <span className="text-[9px] text-neutral-400 font-mono uppercase tracking-widest block">Structural Blueprint</span>
                      <span className="text-[11px] text-gold-400 font-mono uppercase tracking-wider">{comp.subtitle}</span>
                    </div>
                  </motion.div>

                  {/* Composition Details Column with Staggered Scroll Trigger Reveal */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-[10px] text-gold-400 font-mono uppercase tracking-widest block">Deconstructed Composition</span>
                      <h4 className="text-white font-serif text-3xl font-medium tracking-tight mt-1">{comp.title}</h4>
                      <div className="h-0.5 w-12 bg-gold-500/30 mt-3" />
                    </motion.div>

                    {/* Plated Geometry Spec */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      className="px-4 py-3 bg-neutral-950 border border-neutral-900/60 font-mono text-[11px] text-neutral-300"
                    >
                      <span className="text-gold-200 block text-[9px] tracking-widest uppercase">Plating Geometry</span>
                      <span className="text-neutral-400">{comp.geometry}</span>
                    </motion.div>

                    {/* Element Lists (staggered delay scroll trigger!) */}
                    <div className="space-y-3">
                      {comp.elements.map((el, elIdx) => (
                        <motion.div
                          key={elIdx}
                          initial={{ opacity: 0, x: -15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.4, delay: 0.2 + (elIdx * 0.1) }}
                          className="flex justify-between items-baseline gap-4 py-2 border-b border-neutral-900 text-xs font-sans"
                        >
                          <span className="text-neutral-500 font-mono uppercase tracking-wider text-[10px] shrink-0">
                            {el.name}
                          </span>
                          <span className="text-neutral-300 text-right font-light leading-relaxed">
                            {el.value}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Photo Lightbox */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#111827]/98 z-50 flex items-center justify-center p-4 md:p-8"
              onClick={() => setSelectedPhoto(null)}
            >
              <div 
                className="relative max-w-4xl w-full flex flex-col md:flex-row gap-6 bg-neutral-950 border border-gold-500/20 p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button 
                  id="btn-close-lightbox"
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute -top-4 -right-4 p-2 bg-gold-500 text-neutral-100 rounded-full cursor-pointer hover:bg-gold-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Full size photo side */}
                <div className="flex-1 max-h-[60vh] md:max-h-full overflow-hidden bg-neutral-900 border border-neutral-850">
                  <img 
                    src={selectedPhoto.imageUrl} 
                    alt={selectedPhoto.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Narrative properties side */}
                <div className="md:w-80 flex flex-col justify-between py-2 space-y-6">
                  <div className="space-y-4">
                    <span className="text-[10px] text-gold-400 font-mono uppercase tracking-widest block">
                      {selectedPhoto.category} Archive Series
                    </span>
                    <h3 className="text-white font-serif text-2xl font-bold">{selectedPhoto.title}</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed font-sans font-light">
                      {selectedPhoto.description}
                    </p>
                  </div>
                  <div className="space-y-3 pt-6 border-t border-neutral-900">
                    <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                      <span>Plated Geometry</span>
                      <span className="text-neutral-300">Staircase / Concentric</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                      <span>Kitchen Station</span>
                      <span className="text-neutral-300">Garde Manger / Saucier</span>
                    </div>
                    <button 
                      id="btn-dismiss-lightbox"
                      onClick={() => setSelectedPhoto(null)}
                      className="w-full py-2.5 mt-3 border border-neutral-800 text-neutral-400 text-xs font-mono uppercase tracking-widest hover:border-gold-500 hover:text-white transition-all cursor-pointer"
                    >
                      Dismiss View
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

