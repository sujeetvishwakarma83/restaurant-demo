import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu as MenuIcon, X, Sparkles, Footprints, Clock, Wine, Phone, MapPin, Play, Square, 
  VolumeX, Volume2, Award, Heart
} from 'lucide-react';

// Import Custom Modular Components
import { FrontSeat } from './components/FrontSeat';
import { GastronomyMenu } from './components/GastronomyMenu';
import { SpacesAmbiance } from './components/SpacesAmbiance';
import { ChefCanvas } from './components/ChefCanvas';
import { SommelierChat } from './components/SommelierChat';
import { ReservationForm } from './components/ReservationForm';

// Static Data and References
import { TESTIMONIALS, MAP_IMAGE } from './data';

// Web Audio Ambient Synthesizer for Michelin Ambiance
class AmbientSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: any = null;

  start() {
    if (this.isPlaying) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isPlaying = true;

      const playChime = () => {
        if (!this.ctx || this.ctx.state === 'suspended') return;
        
        // Select a random elegant frequency (pentatonic scale of E major: E, F#, G#, B, C#)
        const notes = [164.81, 185.00, 207.65, 246.94, 277.18, 329.63, 369.99, 415.30];
        const freq = notes[Math.floor(Math.random() * notes.length)];

        // Primary bell chime
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Low pass filter to make it exceptionally soft and deep
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, this.ctx.currentTime);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 6.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 6.0);
      };

      // Play soft chime sequences
      playChime();
      this.intervalId = setInterval(() => {
        if (Math.random() > 0.4) playChime();
      }, 4000);

    } catch (e) {
      console.error("Audio Context initialization blocked or failed:", e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

const synthInstance = new AmbientSynth();

export default function App() {
  const [currentSection, setCurrentSection] = useState<string>('front');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [synthPlaying, setSynthPlaying] = useState<boolean>(false);
  const [guestFeedback, setGuestFeedback] = useState<string>('');
  const [feedbacks, setFeedbacks] = useState<{name: string, note: string, rating: number}[]>([
    { name: "Countess Valerie", note: "The Wagyu A5 was a celestial experience. Best service inside Paris.", rating: 5 },
    { name: "Henri Lacombe", note: "An immaculate wine flight, matched only by the precision of Chef Vance's passing pass.", rating: 5 }
  ]);

  const toggleSynth = () => {
    if (synthPlaying) {
      synthInstance.stop();
      setSynthPlaying(false);
    } else {
      synthInstance.start();
      setSynthPlaying(true);
    }
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestFeedback.trim()) return;
    setFeedbacks(prev => [{ name: "Salon Guest", note: guestFeedback, rating: 5 }, ...prev]);
    setGuestFeedback('');
  };

  const navItems = [
    { id: 'front', label: 'Front House' },
    { id: 'menu', label: 'Gastronomy Carta' },
    { id: 'spaces', label: 'VIP Salons' },
    { id: 'canvas', label: 'Chef Canvas' },
    { id: 'sommelier', label: 'AI Sommelier' },
    { id: 'reservations', label: 'Table Booking' },
  ];

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    setMobileMenuOpen(false);
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="full-app-workspace" className="min-h-screen flex flex-col justify-between font-sans relative text-[#e5e2e1] bg-[#0d0d0d]">
      
      {/* UPPER NAVIGATION BAR Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0d0d0dc0] backdrop-blur-md border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
          
          {/* L'ÉCLAT Logo display */}
          <div 
            onClick={() => handleNavigate('front')}
            className="flex flex-col items-start cursor-pointer select-none"
          >
            <h1 className="text-white font-serif text-2xl tracking-[0.25em] font-semibold leading-none">L'ÉCLAT</h1>
            <span className="text-[9px] text-gold-400 font-mono uppercase tracking-[0.45em] mt-0.5">HAUTE GASTRONOMIE</span>
          </div>

          {/* Desktop Links row */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(item => {
              const active = item.id === currentSection;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavigate(item.id)}
                  className={`text-[10px] uppercase font-mono tracking-widest relative py-2 select-none cursor-pointer duration-300 ${
                    active ? 'text-gold-400 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div 
                      layoutId="active-nav-underline" 
                      className="absolute bottom-0 left-1 right-1 h-0.5 bg-gold-400" 
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Special atmospheric sound trigger & mobile desk triggers */}
          <div className="flex items-center gap-4">
            
            {/* Chime Synthesizer button */}
            <button
              id="btn-sound-synth"
              onClick={toggleSynth}
              className={`p-2.5 rounded-none border transition-all flex items-center gap-1.5 cursor-pointer text-[10px] font-mono uppercase tracking-wider ${
                synthPlaying 
                  ? 'border-gold-500 bg-gold-500/10 text-gold-400' 
                  : 'border-neutral-800 bg-transparent text-neutral-400 hover:text-white'
              }`}
              title={synthPlaying ? "Mute luxury ambient chimes" : "Play soft pentatonic restaurant lounge chime generators"}
            >
              {synthPlaying ? <Volume2 className="w-4 h-4 text-gold-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">Ambient Synth</span>
            </button>

            {/* Book Now Quick trigger */}
            <button
              id="header-btn-book"
              onClick={() => handleNavigate('reservations')}
              className="hidden sm:block px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 text-neutral-950 hover:from-gold-500 hover:to-gold-600 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
            >
              Reserve
            </button>

            {/* Hamburger trigger for mobile size */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </header>

      {/* MOBILE FULL DRAWER NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-20 z-30 bg-[#0d0d0d] border-b border-gold-500/10 p-6 flex flex-col justify-between"
          >
            <div className="space-y-4 pt-6">
              {navItems.map(item => (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left py-3.5 border-b border-neutral-900 text-sm font-mono uppercase tracking-widest ${
                    item.id === currentSection ? 'text-gold-400 font-bold' : 'text-neutral-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              id="mobile-nav-book"
              onClick={() => handleNavigate('reservations')}
              className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-neutral-950 font-bold uppercase text-xs tracking-widest text-center"
            >
              Reserve Table Seating
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECONDARY DECORATIVE SUB-BANNER TICKING */}
      <div className="h-10 border-b border-gold-500/[0.04] bg-neutral-950 flex items-center overflow-hidden whitespace-nowrap pt-20 box-content select-none">
        <div className="animate-[marquee_20s_linear_infinite] flex gap-10 text-[9px] uppercase font-mono text-gold-500/40 tracking-[0.3em]">
          <span>★★★ TRIPLE MICHELIN STARRED — EXECUTIVE CHEF JULIAN VANCE — RECRUITING PREMIER DISH FLIGHTS ★★★</span>
          <span>CELLAR LISTINGS EXCEEDING 14,000 ARCHIVAL GRAND CRU BOTTLES — SEATING STRICTLY BY RESERVATION CARD ★★★</span>
          <span>LOCATED INDOORS HISTORIC LE MARAIS SALON — ESTABLISHED IN THE HEART OF PARIS 75004 — DISCOVER SENSORY CHORD SPEECH SYSTEM ★★★</span>
        </div>
      </div>

      {/* CORE DYNAMIC BODY CONTENT AREA */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {currentSection === 'front' && <FrontSeat onNavigate={handleNavigate} />}
            {currentSection === 'menu' && <GastronomyMenu />}
            {currentSection === 'spaces' && <SpacesAmbiance />}
            {currentSection === 'canvas' && <ChefCanvas />}
            {currentSection === 'sommelier' && <SommelierChat />}
            {currentSection === 'reservations' && <ReservationForm />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* EXQUISITE GUESTBOOK REVIEWS GRID */}
      {currentSection === 'front' && (
        <section id="guestbook-section" className="py-20 bg-neutral-950 border-t border-b border-neutral-900 select-none">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline">
              
              <div className="lg:col-span-4 space-y-4">
                <span className="text-[10px] text-gold-400 font-mono uppercase tracking-[0.3em] block">Le Livre d'Or</span>
                <h3 className="text-white font-serif text-3xl font-medium tracking-tight">The Guestbook</h3>
                <p className="text-neutral-400 text-xs font-sans leading-relaxed font-light">
                  Savor the testimonials of distinguished regional gourmands and international reviewers.
                </p>

                {/* Live Guestbook form submission */}
                <form id="feedback-form" onSubmit={submitFeedback} className="space-y-3 pt-4">
                  <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest pl-1 block">Share Your Experience</span>
                  <div className="flex gap-2">
                    <input
                      id="input-guest-note"
                      type="text"
                      placeholder="Comment on your Michelin dining session..."
                      value={guestFeedback}
                      onChange={(e) => setGuestFeedback(e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-850 focus:border-gold-500 text-xs px-3 py-3 font-sans text-neutral-100 font-light"
                    />
                    <button
                      id="btn-submit-feedback"
                      type="submit"
                      className="px-4 py-2 bg-transparent border border-gold-500/20 text-gold-400 hover:border-gold-500 hover:text-white transition-all text-xs font-mono uppercase cursor-pointer"
                    >
                      Publish
                    </button>
                  </div>
                </form>
              </div>

              {/* Slider / Cards column */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Seed Reviews */}
                {feedbacks.map((f, i) => (
                  <div key={i} className="glass-card p-5 border border-gold-500/5 hover:border-gold-500/10 transition-all">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, idx) => (
                        <span key={idx} className="text-gold-400 text-xs leading-none">★</span>
                      ))}
                    </div>
                    <p className="text-neutral-300 font-sans italic text-xs leading-relaxed font-light mb-4">
                      "{f.note}"
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-white">{f.name}</span>
                      <span className="text-neutral-500">Verified Diner</span>
                    </div>
                  </div>
                ))}

                {/* Connoisseur testimony */}
                {TESTIMONIALS.slice(0, 2).map((t) => (
                  <div key={t.id} className="glass-card p-5 border border-gold-500/5 relative">
                    <div className="flex gap-1 mb-3 text-gold-500">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <p className="text-neutral-300 font-sans italic text-xs leading-relaxed font-light mb-4">
                      "{t.quote}"
                    </p>
                    <div className="flex justify-between items-start text-[10px] font-mono">
                      <div>
                        <span className="text-white block">{t.author}</span>
                        <span className="text-neutral-500 block text-[9px]">{t.role}</span>
                      </div>
                      <span className="text-gold-400/80 uppercase text-[9px] tracking-wider">{t.source}</span>
                    </div>
                  </div>
                ))}

              </div>

            </div>

          </div>
        </section>
      )}

      {/* PARIS LOCATION GEOGRAPHY FOOTER PANEL */}
      <footer className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-8 select-none relative overflow-hidden">
        
        {/* Absolute geometry lines */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/[0.01] blur-3xl rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-white font-serif text-xl tracking-[0.2em] font-bold">L'ÉCLAT</h3>
            <span className="text-[10px] text-gold-400 font-mono uppercase tracking-widest block">HAUTE PARISIENNE COOKERY</span>
            <p className="text-neutral-500 text-xs font-sans font-light leading-relaxed max-w-sm">
              We operate standard daily lunch and dinner salons. All tasting flights are created in limited batches to guarantee meticulous Michelin standard precision.
            </p>
            <div className="flex gap-2 pt-2">
              <span className="p-2 bg-neutral-900 border border-neutral-800 text-gold-400 rounded-none">
                <Award className="w-4 h-4" />
              </span>
              <span className="p-2 bg-neutral-900 border border-neutral-800 text-gold-400 rounded-none">
                <Wine className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Contact and address Col */}
          <div className="md:col-span-4 space-y-4 text-xs font-sans font-light text-neutral-400">
            <h4 className="text-xs text-white uppercase tracking-widest font-mono font-medium">Bespoke Concierge desk</h4>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Pl. des Vosges, Le Marais, 75004 Paris, France</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <span className="font-mono">+33 (0)1 45 92 88 59</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Salons open 19:00 — 23:30 (Tue — Sat)</span>
            </div>
          </div>

          {/* Paris Map Area indicator */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest block pl-0.5">Le Marais Location</span>
            <div className="relative h-40 overflow-hidden bg-neutral-900 border border-neutral-850">
              <img 
                src={MAP_IMAGE} 
                alt="Map locating Place des Vosges in the heart of Paris Le Marais" 
                className="w-full h-full object-cover grayscale brightness-75 contrast-125"
              />
              <div className="absolute inset-0 bg-neutral-950/25" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-3 h-3 bg-gold-400 rounded-full animate-ping absolute" />
                <div className="w-3.5 h-3.5 bg-gold-500 rounded-full border-2 border-neutral-950 z-10" />
              </div>
            </div>
          </div>

        </div>

        {/* Legal block */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-600 font-mono uppercase tracking-wider">
          <span>&copy; {new Date().getFullYear()} L'ÉCLAT Gastronomy Paris. All Private Rights Reserved.</span>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-gold-400">Michelin Code of Ethics</a>
            <a href="#" className="hover:text-gold-400">Dress Regulations</a>
          </div>
        </div>

      </footer>

    </div>
  );
}
