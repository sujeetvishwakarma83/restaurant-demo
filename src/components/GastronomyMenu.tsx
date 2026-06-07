import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Soup, Utensils, Dessert, Check, Plus, Trash2, HelpCircle, FileHeart } from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { MenuItem } from '../types';

export const GastronomyMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'starters' | 'mains' | 'desserts'>('starters');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(120);
  const [tastingJourney, setTastingJourney] = useState<MenuItem[]>([]);
  
  // Critique section
  const [critiqueText, setCritiqueText] = useState<string>('');
  const [loadingCritique, setLoadingCritique] = useState<boolean>(false);

  // Available tags to filter
  const allTags = ['Signature', 'Vegetarian', 'Gluten Free', 'Seafood', 'Nuts', 'Meat'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredMenuItems = MENU_ITEMS.filter(item => {
    const matchesCategory = item.category === activeCategory;
    const matchesPrice = item.price <= maxPrice;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => item.tags?.includes(tag));
    return matchesCategory && matchesPrice && matchesTags;
  });

  // Tasting Selection triggers
  const addToJourney = (item: MenuItem) => {
    if (tastingJourney.some(t => t.id === item.id)) return;
    setTastingJourney(prev => [...prev, item]);
    setCritiqueText('');
  };

  const removeFromJourney = (id: string) => {
    setTastingJourney(prev => prev.filter(item => item.id !== id));
    setCritiqueText('');
  };

  const clearJourney = () => {
    setTastingJourney([]);
    setCritiqueText('');
  };

  // Call the server API critique-menu
  const getSommelierCritique = async () => {
    if (tastingJourney.length === 0) return;
    setLoadingCritique(true);
    try {
      const res = await fetch('/api/critique-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: tastingJourney })
      });
      const data = await res.json();
      setCritiqueText(data.text);
    } catch (e) {
      console.error(e);
      setCritiqueText("An exceptional selection! Commencing with crisp Champagne and moving towards a bold Margaux for the Wagyu will complete an immaculate alignment.");
    } finally {
      setLoadingCritique(false);
    }
  };

  const totalTastingCost = tastingJourney.reduce((sum, item) => sum + item.price, 0);

  return (
    <div id="gastronomy-menu-view" className="relative min-h-screen py-24 select-none">
      {/* Immersive backdrop */}
      <div className="absolute inset-0 bg-neutral-950/40 z-0 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.35em] block mb-3">La Carte Haute Gastronomie</span>
          <h2 className="text-white font-serif text-3xl md:text-5xl font-medium tracking-tight mb-4">Culinary Masterpieces</h2>
          <p className="text-neutral-400 font-sans text-sm font-light leading-relaxed">
            Every creation is assembled à la minute, balancing seasonal treasures with advanced kitchen alchemy. Hover over elements to trace culinary properties.
          </p>
        </div>

        {/* Workspace Matrix: Filters + Items + Bespoke Journey builder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Sub-filters (Category, Price, Tags) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Category Selectors */}
            <div className="glass-card p-5 border border-gold-500/5">
              <h3 className="text-xs text-neutral-400 font-mono uppercase tracking-widest mb-4">Course Categories</h3>
              <div className="flex flex-col gap-2">
                {(['starters', 'mains', 'desserts'] as const).map(cat => (
                  <button
                    key={cat}
                    id={`btn-cat-${cat}`}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full px-4 py-3 text-left text-xs uppercase tracking-widest transition-all flex items-center justify-between cursor-pointer ${
                      activeCategory === cat 
                        ? 'bg-gold-500/10 border-l-[3px] border-gold-500 text-gold-400 font-bold' 
                        : 'bg-neutral-900/40 hover:bg-neutral-900 border-l-[3px] border-transparent text-neutral-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {cat === 'starters' && <Soup className="w-4 h-4" />}
                      {cat === 'mains' && <Utensils className="w-4 h-4" />}
                      {cat === 'desserts' && <Dessert className="w-4 h-4" />}
                      {cat}
                    </span>
                    <span className="text-[10px] opacity-60 font-mono">
                      ({MENU_ITEMS.filter(i => i.category === cat).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider Filter */}
            <div className="glass-card p-5 border border-gold-500/5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs text-neutral-400 font-mono uppercase tracking-widest">Pricing Limit</h3>
                <span className="text-gold-400 font-mono text-xs font-semibold">€{maxPrice}</span>
              </div>
              <input 
                id="input-price-filter"
                type="range" 
                min="20" 
                max="120"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold-500 bg-neutral-900 cursor-pointer h-1 rounded"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                <span>€20</span>
                <span>€120</span>
              </div>
            </div>

            {/* Tag Badges */}
            <div className="glass-card p-5 border border-gold-500/5">
              <h3 className="text-xs text-neutral-400 font-mono uppercase tracking-widest mb-4">Dietary & Style</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      id={`btn-tag-${tag.toLowerCase().replace(' ', '-')}`}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-none border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-gold-500/10 border-gold-400 text-gold-400 font-medium' 
                          : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              {selectedTags.length > 0 && (
                <button
                  id="btn-reset-tags"
                  onClick={() => setSelectedTags([])}
                  className="mt-4 text-[10px] text-red-400 font-mono underline cursor-pointer hover:text-red-300 block"
                >
                  Clear Tags Filter
                </button>
              )}
            </div>

          </div>

          {/* MIDDLE: Filtered Food Items List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs text-neutral-400 font-mono uppercase tracking-widest px-1">
              Selections ({filteredMenuItems.length} items found)
            </h3>

            <AnimatePresence mode="popLayout">
              {filteredMenuItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-8 border border-dashed border-neutral-800 text-center space-y-3"
                >
                  <p className="text-sm text-neutral-500 font-mono">No creations match the selected criteria.</p>
                  <button 
                    id="btn-soft-reset"
                    onClick={() => { setMaxPrice(120); setSelectedTags([]); }}
                    className="text-xs text-gold-400 underline font-mono cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                filteredMenuItems.map(item => {
                  const exists = tastingJourney.some(t => t.id === item.id);
                  return (
                    <motion.div
                      key={item.id}
                      layoutId={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="glass-card p-5 border border-gold-500/5 hover:border-gold-500/15 transition-all group duration-300 flex justify-between items-start gap-4 relative overflow-hidden"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <h4 className="text-white text-base font-serif font-medium">{item.name}</h4>
                          <span className="text-gold-500/60 text-xs italic font-serif">({item.frenchName})</span>
                        </div>
                        <p className="text-neutral-400 text-xs font-sans font-light leading-relaxed max-w-md">
                          {item.description}
                        </p>
                        {item.tags && (
                          <div className="flex gap-1.5 pt-1.5">
                            {item.tags.map(t => (
                              <span key={t} className="px-2 py-0.5 text-[8px] uppercase tracking-widest bg-neutral-900 text-neutral-500 border border-neutral-800 font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-right space-y-4 flex flex-col items-end shrink-0">
                        <span className="text-sm font-semibold text-gold-400 font-mono">€{item.price}</span>
                        <button
                          id={`btn-add-${item.id}`}
                          onClick={() => addToJourney(item)}
                          disabled={exists}
                          className={`p-2 rounded-none border transition-all ${
                            exists 
                              ? 'bg-neutral-900 border-neutral-800 text-neutral-600' 
                              : 'bg-gold-500/5 border-gold-500/20 hover:bg-gold-500/10 text-gold-400 hover:border-gold-500 cursor-pointer'
                          }`}
                          title={exists ? "Already added to your journey" : "Add to bespoke tasting progression"}
                        >
                          {exists ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Bespoke Tasting Progression Board (Stateful localStorage-like builder) */}
          <div className="lg:col-span-4">
            <div id="tasting-progression-panel" className="glass-card p-6 border border-gold-500/10 luxury-shadow relative overflow-hidden bg-neutral-900/20">
              
              <div className="absolute top-0 right-0 p-8 opacity-5 text-gold-400 pointer-events-none">
                <FileHeart className="w-32 h-32" />
              </div>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[10px] text-gold-400 font-mono uppercase tracking-widest block">Custom Degustation</span>
                  <h3 className="text-white text-lg font-serif">Bespoke Experience</h3>
                </div>
                {tastingJourney.length > 0 && (
                  <button
                    id="btn-clear-tasting"
                    onClick={clearJourney}
                    className="text-[10px] text-neutral-500 hover:text-red-400 font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Reset List
                  </button>
                )}
              </div>

              {tastingJourney.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-neutral-800 space-y-3">
                  <p className="text-xs text-neutral-500 font-sans font-light max-w-[200px] mx-auto">
                    Compile your customized tasting flight by selecting creations from L'Éclat menu.
                  </p>
                  <span className="inline-block text-[10px] bg-neutral-900 px-3 py-1 font-mono text-gold-500/60 uppercase tracking-widest">
                    No items selected
                  </span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {tastingJourney.map((item, idx) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-neutral-950 pb-3 border-b border-neutral-900">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-gold-500/60">COURSE 0{idx + 1}</span>
                          <h4 className="text-xs text-neutral-100 font-sans font-medium">{item.name}</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-neutral-400">€{item.price}</span>
                          <button
                            id={`btn-remove-journey-${item.id}`}
                            onClick={() => removeFromJourney(item.id)}
                            className="text-neutral-500 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary indicators */}
                  <div className="pt-4 border-t border-neutral-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400 font-sans">Flight Size</span>
                      <span className="text-white font-mono">{tastingJourney.length} course{tastingJourney.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-neutral-900">
                      <span className="text-white font-serif font-medium">Accumulated Cost</span>
                      <span className="text-gold-400 font-mono font-bold">€{totalTastingCost}</span>
                    </div>
                  </div>

                  {/* Sommelier critique request */}
                  <div className="space-y-3 pt-2">
                    <button
                      id="btn-critique-tasting"
                      onClick={getSommelierCritique}
                      disabled={loadingCritique}
                      className="w-full py-3 bg-neutral-950 hover:bg-neutral-900 border border-gold-500/30 text-gold-400 text-xs uppercase tracking-widest font-mono hover:border-gold-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loadingCritique ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                          Summoning Cellar Master...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                          Critique Flight Progression
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {critiqueText && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-neutral-950 p-4 border border-gold-500/10 overflow-hidden"
                        >
                          <span className="text-[10px] text-gold-400 font-mono uppercase tracking-widest block mb-2">★★★★★ Head Sommelier Note:</span>
                          <p className="text-[11px] text-neutral-300 font-sans leading-relaxed italic font-light whitespace-pre-line">
                            "{critiqueText}"
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
