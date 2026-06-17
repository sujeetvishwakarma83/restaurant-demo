import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu as MenuIcon, X, Sparkles, Footprints, Clock, Wine, Phone, MapPin, Play, Square, 
  VolumeX, Volume2, Award, Heart, Instagram, Facebook, Youtube, Linkedin
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
    <div id="full-app-workspace" className="min-h-screen flex flex-col justify-between font-sans relative text-neutral-500 bg-neutral-950">
      
      {/* UPPER NAVIGATION BAR Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] lg:w-[calc(100%-5rem)] max-w-7xl z-40 bg-neutral-950/90 backdrop-blur-md border border-neutral-850 rounded-full shadow-lg transition-all duration-300">
        <div className="w-full px-4 md:px-8 h-14 flex justify-between items-center">
          
          {/* L'ÉCLAT Logo display */}
          <div 
            onClick={() => handleNavigate('front')}
            className="flex flex-col items-start cursor-pointer select-none"
          >
            <h1 className="text-neutral-200 font-serif text-xl tracking-[0.2em] font-semibold leading-none">L'ÉCLAT</h1>
            <span className="text-[8px] text-gold-500 font-sans font-medium uppercase tracking-[0.3em] mt-0.5">HAUTE GASTRONOMIE</span>
          </div>

          {/* Desktop Links row */}
          <nav className="hidden lg:flex items-center gap-3">
            {navItems.map(item => {
              const active = item.id === currentSection;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavigate(item.id)}
                  className={`text-[10px] uppercase font-serif font-semibold tracking-[2px] px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer select-none border ${
                    active 
                      ? 'text-gold-500 bg-gold-500/10 border-gold-500/30 shadow-[0_2px_10px_rgba(201,162,39,0.08)] font-bold' 
                      : 'text-neutral-500 bg-transparent border-transparent hover:text-neutral-950 hover:bg-gold-500 hover:border-gold-500 hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(251,176,59,0.15)]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Special atmospheric sound trigger & mobile desk triggers */}
          <div className="flex items-center gap-3">
            
            {/* Desktop Social links in header - right aligned */}
            <div className="hidden lg:flex items-center gap-3 border-r border-neutral-850 pr-4 mr-1">
              <a 
                href="https://www.instagram.com/cabbage_code/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#E1306C] hover:text-[#d6245c] transition-all duration-300 hover:scale-110 cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61590796371705" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#1877F2] hover:text-[#166fe5] transition-all duration-300 hover:scale-110 cursor-pointer"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://www.youtube.com/@SujeetCabbageCode" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#FF0000] hover:text-[#e60000] transition-all duration-300 hover:scale-110 cursor-pointer"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/sujeet-vishwakarma-a19b2323a" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#0A66C2] hover:text-[#0955a0] transition-all duration-300 hover:scale-110 cursor-pointer"
                title="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://wa.me/917800383448" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#25D366] hover:text-[#20ba5a] transition-all duration-300 hover:scale-110 cursor-pointer"
                title="WhatsApp"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.79 9.79 0 0 0-6.979-2.889c-5.439 0-9.865 4.37-9.87 9.799-.001 1.77.469 3.5 1.36 5.01L1.9 21.75l6.09-1.597zM17.487 14.39c-.3-.15-1.782-.879-2.062-.98-.28-.1-.485-.15-.685.15-.2.3-.775.98-.95 1.18-.175.2-.35.225-.65.075-1.03-.519-1.77-1.002-2.428-1.579-.658-.577-1.126-1.282-1.353-1.68-.225-.4-.025-.615.175-.813.18-.18.4-.465.6-.7.2-.235.265-.4.4-.665.135-.265.066-.5-.033-.7-.1-.2-.875-2.115-1.2-2.902-.315-.765-.64-.66-.875-.672-.225-.01-.485-.012-.745-.012-.26 0-.685.1-1.045.49-.36.39-1.38 1.35-1.38 3.293s1.42 3.82 1.62 4.09c.2.27 2.79 4.26 6.755 5.972.945.41 1.68.65 2.255.83.95.302 1.81.26 2.49.16.76-.11 2.285-.93 2.605-1.83.32-.9 0-.28-.32-1.89-3.23-1.63z" />
                </svg>
              </a>
            </div>

            {/* Chime Synthesizer button */}
            <button
              id="btn-sound-synth"
              onClick={toggleSynth}
              className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer text-[9px] font-sans font-medium uppercase tracking-wider ${
                synthPlaying 
                  ? 'border-gold-500 bg-gold-500/10 text-gold-500' 
                  : 'border-neutral-850 bg-transparent text-neutral-500 hover:text-gold-500'
              }`}
              title={synthPlaying ? "Mute luxury ambient chimes" : "Play soft pentatonic restaurant lounge chime generators"}
            >
              {synthPlaying ? <Volume2 className="w-3.5 h-3.5 text-gold-500" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">Ambient Synth</span>
            </button>

            {/* Book Now Quick trigger */}
            <button
              id="header-btn-book"
              onClick={() => handleNavigate('reservations')}
              className="hidden sm:block px-4 py-1.5 bg-gradient-to-r from-gold-600 to-gold-500 text-neutral-100 hover:from-gold-500 hover:to-gold-600 text-[9px] font-bold uppercase tracking-widest cursor-pointer rounded-full"
            >
              Reserve
            </button>

            {/* Hamburger trigger for mobile size */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-neutral-500 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </header>

      {/* MOBILE FULL DRAWER NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="fixed top-20 left-4 right-4 bottom-4 z-30 bg-neutral-950/95 backdrop-blur-md border border-neutral-850 p-6 rounded-2xl shadow-xl flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-4 pt-6 shrink-0">
              {navItems.map(item => (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left py-3.5 border-b border-neutral-900 text-sm font-serif uppercase tracking-widest ${
                    item.id === currentSection ? 'text-gold-500 font-bold' : 'text-neutral-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-6 shrink-0 mt-8">
              <button
                id="mobile-nav-book"
                onClick={() => handleNavigate('reservations')}
                className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-neutral-100 font-bold uppercase text-xs tracking-widest text-center cursor-pointer rounded-full"
              >
                Reserve Table Seating
              </button>

              {/* Mobile Social Links */}
              <div className="flex justify-center items-center gap-6 py-4 border-t border-neutral-900">
                <a 
                  href="https://www.instagram.com/cabbage_code/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 bg-neutral-900 border border-[#E1306C]/30 text-[#E1306C] hover:border-[#E1306C] hover:bg-[#E1306C]/5 rounded-full transition-all cursor-pointer hover:scale-110 animate-fade-in"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61590796371705" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 bg-neutral-900 border border-[#1877F2]/30 text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/5 rounded-full transition-all cursor-pointer hover:scale-110 animate-fade-in"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.youtube.com/@SujeetCabbageCode" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 bg-neutral-900 border border-[#FF0000]/30 text-[#FF0000] hover:border-[#FF0000] hover:bg-[#FF0000]/5 rounded-full transition-all cursor-pointer hover:scale-110 animate-fade-in"
                  title="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/sujeet-vishwakarma-a19b2323a" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 bg-neutral-900 border border-[#0A66C2]/30 text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/5 rounded-full transition-all cursor-pointer hover:scale-110 animate-fade-in"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://wa.me/917800383448" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 bg-neutral-900 border border-[#25D366]/30 text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/5 rounded-full transition-all cursor-pointer hover:scale-110 animate-fade-in"
                  title="WhatsApp"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.79 9.79 0 0 0-6.979-2.889c-5.439 0-9.865 4.37-9.87 9.799-.001 1.77.469 3.5 1.36 5.01L1.9 21.75l6.09-1.597zM17.487 14.39c-.3-.15-1.782-.879-2.062-.98-.28-.1-.485-.15-.685.15-.2.3-.775.98-.95 1.18-.175.2-.35.225-.65.075-1.03-.519-1.77-1.002-2.428-1.579-.658-.577-1.126-1.282-1.353-1.68-.225-.4-.025-.615.175-.813.18-.18.4-.465.6-.7.2-.235.265-.4.4-.665.135-.265.066-.5-.033-.7-.1-.2-.875-2.115-1.2-2.902-.315-.765-.64-.66-.875-.672-.225-.01-.485-.012-.745-.012-.26 0-.685.1-1.045.49-.36.39-1.38 1.35-1.38 3.293s1.42 3.82 1.62 4.09c.2.27 2.79 4.26 6.755 5.972.945.41 1.68.65 2.255.83.95.302 1.81.26 2.49.16.76-.11 2.285-.93 2.605-1.83.32-.9 0-.28-.32-1.89-3.23-1.63z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



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
            {currentSection === 'spaces' && <SpacesAmbiance onNavigate={handleNavigate} />}
            {currentSection === 'canvas' && <ChefCanvas />}
            {currentSection === 'sommelier' && <SommelierChat />}
            {currentSection === 'reservations' && <ReservationForm />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* EXQUISITE GUESTBOOK REVIEWS GRID */}
      {currentSection === 'front' && (
        <section id="guestbook-section" className="py-20 bg-neutral-900 border-t border-b border-neutral-850 select-none">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline">
              
              <div className="lg:col-span-4 space-y-4">
                <span className="text-[10px] text-gold-500 font-mono uppercase tracking-[0.3em] block">Le Livre d'Or</span>
                <h3 className="text-neutral-200 font-serif text-3xl font-medium tracking-tight">The Guestbook</h3>
                <p className="text-neutral-450 text-xs font-sans leading-relaxed font-light">
                  Savor the testimonials of distinguished regional gourmands and international reviewers.
                </p>

                {/* Live Guestbook form submission */}
                <form id="feedback-form" onSubmit={submitFeedback} className="space-y-3 pt-4">
                  <span className="text-[9px] text-neutral-450 font-mono uppercase tracking-widest pl-1 block">Share Your Experience</span>
                  <div className="flex gap-2">
                    <input
                      id="input-guest-note"
                      type="text"
                      placeholder="Comment on your Michelin dining session..."
                      value={guestFeedback}
                      onChange={(e) => setGuestFeedback(e.target.value)}
                      className="flex-1 bg-neutral-950 border border-neutral-850 focus:border-gold-500 text-xs px-3 py-3 font-sans text-neutral-200 font-light"
                    />
                    <button
                      id="btn-submit-feedback"
                      type="submit"
                      className="px-4 py-2 bg-transparent border border-gold-500/20 text-gold-500 hover:bg-gold-500 hover:text-neutral-100 transition-all text-xs font-mono uppercase cursor-pointer"
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
                        <span key={idx} className="text-gold-500 text-xs leading-none">★</span>
                      ))}
                    </div>
                    <p className="text-neutral-350 font-sans italic text-xs leading-relaxed font-light mb-4">
                      "{f.note}"
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-neutral-200">{f.name}</span>
                      <span className="text-neutral-455">Verified Diner</span>
                    </div>
                  </div>
                ))}

                {/* Connoisseur testimony */}
                {TESTIMONIALS.slice(0, 2).map((t) => (
                  <div key={t.id} className="glass-card p-5 border border-gold-500/5 relative">
                    <div className="flex gap-1 mb-3 text-gold-500">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <p className="text-neutral-350 font-sans italic text-xs leading-relaxed font-light mb-4">
                      "{t.quote}"
                    </p>
                    <div className="flex justify-between items-start text-[10px] font-mono">
                      <div>
                        <span className="text-neutral-200 block">{t.author}</span>
                        <span className="text-neutral-455 block text-[9px]">{t.role}</span>
                      </div>
                      <span className="text-gold-500/80 uppercase text-[9px] tracking-wider">{t.source}</span>
                    </div>
                  </div>
                ))}

              </div>

            </div>

          </div>
        </section>
      )}

      {/* PARIS LOCATION GEOGRAPHY FOOTER PANEL */}
      <footer className="bg-neutral-950 border-t border-neutral-850 pt-20 pb-10 select-none relative overflow-hidden">
        
        {/* Absolute geometry lines */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/[0.01] blur-3xl rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start">
          
          {/* Brand Col */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-neutral-200 font-serif text-2xl tracking-[0.2em] font-bold">L'ÉCLAT</h3>
            <span className="text-[9px] text-gold-500 font-sans font-semibold uppercase tracking-widest block">HAUTE PARISIENNE COOKERY</span>
            <p className="text-neutral-500 text-xs font-sans font-normal leading-relaxed max-w-sm">
              We operate standard daily lunch and dinner salons. All tasting flights are created in limited batches to guarantee meticulous Michelin standard precision.
            </p>
            <div className="flex gap-2.5 pt-1">
              <span className="p-2.5 bg-neutral-900 border border-neutral-850 text-gold-500 rounded-lg flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-wider select-none">
                <Award className="w-4 h-4" /> Michelin Guide
              </span>
              <span className="p-2.5 bg-neutral-900 border border-neutral-850 text-gold-500 rounded-lg flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-wider select-none">
                <Wine className="w-4 h-4" /> Grand Cru Cellar
              </span>
            </div>
            
            {/* Social Media Links Panel */}
            <div className="flex gap-3 pt-2">
              <a 
                href="https://www.instagram.com/cabbage_code/" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 bg-neutral-900 border border-[#E1306C]/30 text-[#E1306C] hover:border-[#E1306C] hover:bg-[#E1306C]/5 rounded-full transition-all cursor-pointer hover:scale-110"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61590796371705" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 bg-neutral-900 border border-[#1877F2]/30 text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/5 rounded-full transition-all cursor-pointer hover:scale-110"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.youtube.com/@SujeetCabbageCode" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 bg-neutral-900 border border-[#FF0000]/30 text-[#FF0000] hover:border-[#FF0000] hover:bg-[#FF0000]/5 rounded-full transition-all cursor-pointer hover:scale-110"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/sujeet-vishwakarma-a19b2323a" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 bg-neutral-900 border border-[#0A66C2]/30 text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/5 rounded-full transition-all cursor-pointer hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/917800383448" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 bg-neutral-900 border border-[#25D366]/30 text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/5 rounded-full transition-all cursor-pointer hover:scale-110"
                title="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.79 9.79 0 0 0-6.979-2.889c-5.439 0-9.865 4.37-9.87 9.799-.001 1.77.469 3.5 1.36 5.01L1.9 21.75l6.09-1.597zM17.487 14.39c-.3-.15-1.782-.879-2.062-.98-.28-.1-.485-.15-.685.15-.2.3-.775.98-.95 1.18-.175.2-.35.225-.65.075-1.03-.519-1.77-1.002-2.428-1.579-.658-.577-1.126-1.282-1.353-1.68-.225-.4-.025-.615.175-.813.18-.18.4-.465.6-.7.2-.235.265-.4.4-.665.135-.265.066-.5-.033-.7-.1-.2-.875-2.115-1.2-2.902-.315-.765-.64-.66-.875-.672-.225-.01-.485-.012-.745-.012-.26 0-.685.1-1.045.49-.36.39-1.38 1.35-1.38 3.293s1.42 3.82 1.62 4.09c.2.27 2.79 4.26 6.755 5.972.945.41 1.68.65 2.255.83.95.302 1.81.26 2.49.16.76-.11 2.285-.93 2.605-1.83.32-.9 0-.28-.32-1.89-3.23-1.63z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links / Sitemap Col */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs text-neutral-200 uppercase tracking-widest font-mono font-bold border-b border-neutral-850 pb-2">Navigation</h4>
            <ul className="space-y-2.5 text-xs font-sans font-medium text-neutral-500">
              {navItems.map(item => (
                <li key={item.id}>
                  <button 
                    onClick={() => handleNavigate(item.id)}
                    className="hover:text-gold-500 transition-colors cursor-pointer text-left font-serif uppercase tracking-wider text-[11px]"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact and address Col */}
          <div className="lg:col-span-2 space-y-4 text-xs font-sans font-medium text-neutral-500">
            <h4 className="text-xs text-neutral-200 uppercase tracking-widest font-mono font-bold border-b border-neutral-850 pb-2">Bespoke Concierge</h4>
            
            <div className="flex items-start gap-3 pt-1">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">Pl. des Vosges, Le Marais,<br />75004 Paris, France</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gold-500 shrink-0" />
              <a href="tel:+330145928859" className="font-mono hover:text-gold-500 transition-colors">+33 (0)1 45 92 88 59</a>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">Salons open 19:00 — 23:30<br />Tuesday to Saturday</span>
            </div>
          </div>

          {/* Paris Map Area indicator */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs text-neutral-200 uppercase tracking-widest font-mono font-bold border-b border-neutral-850 pb-2">Le Marais Location</h4>
            <div className="relative h-48 overflow-hidden bg-neutral-950 border border-neutral-850 rounded-xl group shadow-sm">
              <iframe 
                src="https://maps.google.com/maps?q=Place%20des%20Vosges,%20Paris,%20France&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-700"
                title="Google Map of Place des Vosges, Paris, France"
              />
            </div>
          </div>

          {/* Portfolio QR Code Col */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs text-neutral-200 uppercase tracking-widest font-mono font-bold border-b border-neutral-850 pb-2">Developer Portfolio</h4>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 items-start">
              <div className="qr-scanner-container w-28 h-28 shrink-0 bg-neutral-900 border border-neutral-850 p-2 rounded-xl group hover:border-gold-500/50 hover:shadow-[0_0_15px_rgba(251,176,59,0.25)] transition-all duration-300">
                <div className="qr-scan-line" />
                <img 
                  src="/videos/QR.png" 
                  alt="Developer Portfolio QR Code" 
                  className="w-full h-full object-cover rounded-lg transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="space-y-2.5">
                <p className="text-neutral-550 text-[11px] font-sans font-normal leading-relaxed">
                  Scan to view my portfolio or reach out for custom development.
                </p>
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <a 
                    href="https://www.linkedin.com/in/sujeet-vishwakarma-a19b2323a" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-gold-500 hover:text-gold-600 transition-colors uppercase tracking-widest group/link"
                  >
                    Visit Website 
                    <Sparkles className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:scale-110" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Legal block */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-6 border-t border-neutral-850 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-500 font-sans uppercase tracking-wider font-semibold">
          <span>&copy; {new Date().getFullYear()} L'ÉCLAT Gastronomy Paris. All Private Rights Reserved.</span>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-gold-500 transition-colors">Michelin Code of Ethics</a>
            <a href="#" className="hover:text-gold-500 transition-colors">Dress Regulations</a>
          </div>
        </div>

      </footer>

    </div>
  );
}
