import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Clock, Coffee, ShieldCheck, Mail, Phone, User, Compass, Sparkles, CheckCircle, Search, Ticket, History } from 'lucide-react';
import { Reservation } from '../types';

export const ReservationForm: React.FC = () => {
  // Booking fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState<number>(2);
  const [time, setTime] = useState('19:30');
  const [tableType, setTableType] = useState<'standard' | 'window' | 'chef-table' | 'private-alcove'>('standard');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // App state
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [searchCode, setSearchCode] = useState('');
  const [searchedRes, setSearchedRes] = useState<Reservation | null>(null);
  const [searchError, setSearchError] = useState('');

  // History state controls
  const [historyTab, setHistoryTab] = useState<'all' | 'upcoming' | 'past'>('all');
  
  // Initialize from LocalStorage + structured Mock Bookings (upcoming & past counts)
  const [historyList, setHistoryList] = useState<Reservation[]>(() => {
    const initialMockBookings: Reservation[] = [
      {
        id: 'ECLAT-X78B-2026',
        name: 'Baron Frederick Sterling',
        email: 'sterling@luxurymail.com',
        phone: '+33 6 12 34 56 78',
        date: '2026-06-18',
        time: '20:00',
        guests: 4,
        tableType: 'window',
        status: 'confirmed',
        specialRequests: 'Prefer champagne as welcome pours.'
      },
      {
        id: 'ECLAT-D32A-2026',
        name: 'Baron Frederick Sterling',
        email: 'sterling@luxurymail.com',
        phone: '+33 6 12 34 56 78',
        date: '2026-05-12',
        time: '19:30',
        guests: 2,
        tableType: 'chef-table',
        status: 'confirmed',
        specialRequests: 'Chef\'s tasting flight selected.'
      },
      {
        id: 'ECLAT-K45F-2026',
        name: 'Baron Frederick Sterling',
        email: 'sterling@luxurymail.com',
        phone: '+33 6 12 34 56 78',
        date: '2026-04-10',
        time: '21:00',
        guests: 2,
        tableType: 'standard',
        status: 'cancelled',
        specialRequests: 'Anniversary dinner plans modified.'
      }
    ];

    try {
      const storedIds = JSON.parse(localStorage.getItem('eclat_ids') || '[]');
      const storedBookings: Reservation[] = [];
      storedIds.forEach((id: string) => {
        const item = localStorage.getItem(id);
        if (item) {
          storedBookings.push(JSON.parse(item));
        }
      });
      
      const combined = [...storedBookings];
      initialMockBookings.forEach(mockItem => {
        if (!combined.some(stored => stored.id === mockItem.id)) {
          combined.push(mockItem);
        }
      });
      return combined;
    } catch (e) {
      console.error(e);
      return initialMockBookings;
    }
  });

  // Filter history records
  const filteredHistory = historyList.filter(item => {
    if (historyTab === 'all') return true;
    const isUpcoming = item.date >= '2026-06-06';
    if (historyTab === 'upcoming') {
      return isUpcoming;
    }
    if (historyTab === 'past') {
      return !isUpcoming;
    }
    return true;
  });

  // Submit booking
  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date) return;

    // Create unique code
    const uniqueSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const confCode = `ECLAT-${uniqueSuffix}-${new Date(date).getFullYear() || 2026}`;

    const newRes: Reservation = {
      id: confCode,
      name,
      email,
      phone,
      date,
      guests,
      time,
      tableType,
      specialRequests: specialRequests.trim() || undefined,
      status: 'confirmed'
    };

    // Save in localStorage
    localStorage.setItem(confCode, JSON.stringify(newRes));
    
    // Save email index to lookup
    const existingIds = JSON.parse(localStorage.getItem('eclat_ids') || '[]');
    localStorage.setItem('eclat_ids', JSON.stringify([...existingIds, confCode]));

    setConfirmedReservation(newRes);
    setHistoryList(prev => [newRes, ...prev]);
    
    // Reset booking form
    setName('');
    setEmail('');
    setPhone('');
    setDate('');
    setGuests(2);
    setTime('19:30');
    setTableType('standard');
    setSpecialRequests('');
  };

  // Search Reservation
  const lookupBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSearchedRes(null);

    if (!searchCode.trim()) return;

    const code = searchCode.trim().toUpperCase();
    const found = localStorage.getItem(code);

    if (found) {
      setSearchedRes(JSON.parse(found));
    } else {
      // Also look up in memory mock array in case it's one of them
      const memoryFound = historyList.find(item => item.id === code);
      if (memoryFound) {
        setSearchedRes(memoryFound);
      } else {
        setSearchError("No reservation matches this signature code. Please verify.");
      }
    }
  };

  // Cancel dynamic Reservation
  const handleCancelBooking = (code: string) => {
    const found = localStorage.getItem(code);
    let updatedRes: Reservation | null = null;
    
    if (found) {
      const resData = JSON.parse(found) as Reservation;
      resData.status = 'cancelled';
      localStorage.setItem(code, JSON.stringify(resData));
      updatedRes = resData;
    } else {
      const mockItem = historyList.find(item => item.id === code);
      if (mockItem) {
        const updatedMock = { ...mockItem, status: 'cancelled' as const };
        localStorage.setItem(code, JSON.stringify(updatedMock));
        updatedRes = updatedMock;
      }
    }

    if (updatedRes) {
      if (confirmedReservation?.id === code) {
        setConfirmedReservation(updatedRes);
      }
      if (searchedRes?.id === code) {
        setSearchedRes(updatedRes);
      }
    }

    setHistoryList(prev => prev.map(item => {
      if (item.id === code) {
        return { ...item, status: 'cancelled' as const };
      }
      return item;
    }));
  };

  return (
    <div id="reservation-form-view" className="relative min-h-screen py-24 select-none">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold-500 font-serif text-[13px] uppercase tracking-[0.35em] block mb-3 font-semibold">La Passerelle des Réservations</span>
          <h2 className="text-neutral-200 font-serif text-[36px] md:text-[46px] font-bold tracking-tight mb-4 leading-none">Secure a Dining Salon</h2>
          <p className="text-neutral-500 font-sans text-[16px] md:text-[18px] font-normal leading-relaxed">
            Seating at L’Éclat is tightly calculated to protect the sensory space for each guest. Select your salon tier and secure your priority invitation.
          </p>
        </div>

        {/* Workspace divide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Reservation Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 md:p-8 border border-neutral-850 bg-neutral-950 rounded-2xl shadow-md">
              <span className="text-[10px] text-gold-500 font-sans font-semibold uppercase tracking-widest block mb-5">★★★★★ Dining Desk Portal</span>
              
              <form id="booking-form" onSubmit={handleBookTable} className="space-y-6">
                
                {/* Visual grid parameter fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Date selection field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block pl-1">Choose Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-450 w-4 h-4 pointer-events-none" />
                      <input 
                        id="input-res-date"
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-850 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-xs pl-10 pr-3.5 py-3.5 text-neutral-500 placeholder-neutral-450 focus:outline-none font-sans font-normal rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  {/* Time slots selection field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block pl-1">Dining Hour</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-455 w-4 h-4 pointer-events-none" />
                      <select
                        id="select-res-time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-850 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-xs pl-10 pr-3 py-3.5 text-neutral-500 focus:outline-none font-sans font-normal rounded-xl cursor-pointer appearance-none transition-all"
                      >
                        <option value="19:00">19:00 PM (Aperitif)</option>
                        <option value="19:30">19:30 PM (Peak Salon)</option>
                        <option value="20:00">20:00 PM (Main Flight)</option>
                        <option value="20:30">20:30 PM (Main Flight)</option>
                        <option value="21:00">21:00 PM (Late Flight)</option>
                        <option value="21:30">21:30 PM (Late Night)</option>
                      </select>
                    </div>
                  </div>

                  {/* Guests field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block pl-1">Party Size</label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-455 w-4 h-4 pointer-events-none" />
                      <select
                        id="select-res-guests"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-850 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-xs pl-10 pr-3 py-3.5 text-neutral-500 focus:outline-none font-sans font-normal rounded-xl cursor-pointer appearance-none transition-all"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                          <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>

                {/* Seating Tier selectors */}
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block pl-1">Dining Salon Seating Tier</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { value: 'standard', name: 'Grande Salle', limit: '1-12' },
                      { value: 'window', name: 'Marais View', limit: '1-4' },
                      { value: 'chef-table', name: 'Chef Pass', limit: '1-6' },
                      { value: 'private-alcove', name: 'Private Suite', limit: '2-12' }
                    ].map(tier => (
                      <button
                        key={tier.value}
                        id={`btn-tier-${tier.value}`}
                        type="button"
                        onClick={() => setTableType(tier.value as any)}
                        className={`p-4 border transition-all text-center flex flex-col justify-center items-center gap-1 cursor-pointer rounded-xl duration-300 ${
                          tableType === tier.value
                            ? 'border-gold-500 bg-gold-500/10 text-gold-500 font-bold shadow-[0_4px_12px_rgba(201,162,39,0.12)] scale-[1.02]'
                            : 'border-neutral-850 bg-neutral-950 text-neutral-500 hover:border-gold-500/30 hover:bg-gold-500/[0.02] hover:scale-[1.01]'
                        }`}
                      >
                        <span className="text-[11px] font-serif uppercase tracking-wider font-semibold leading-none">{tier.name}</span>
                        <span className="text-[8px] font-mono block uppercase tracking-widest mt-1 text-neutral-450 font-bold">{tier.limit} Pax</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal particulars fields */}
                <div className="space-y-4">
                       {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block pl-1">Your Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-450 w-4 h-4 pointer-events-none" />
                      <input 
                        id="input-res-name"
                        type="text"
                        required
                        placeholder="e.g. Baron Frederick Sterling"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-850 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-xs pl-10 pr-4 py-3.5 text-neutral-500 placeholder-neutral-450 focus:outline-none font-sans font-normal rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  {/* Contact details row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Email field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block pl-1">Secure Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-450 w-4 h-4 pointer-events-none" />
                        <input 
                          id="input-res-email"
                          type="email"
                          required
                          placeholder="yourname@luxurymail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-850 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-xs pl-10 pr-4 py-3.5 text-neutral-500 placeholder-neutral-450 focus:outline-none font-sans font-normal rounded-xl transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block pl-1">Mobile Line</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-450 w-4 h-4 pointer-events-none" />
                        <input 
                          id="input-res-phone"
                          type="tel"
                          required
                          placeholder="+33 6 00 00 00 00"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-850 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-xs pl-10 pr-4 py-3.5 text-neutral-500 placeholder-neutral-450 focus:outline-none font-sans font-normal rounded-xl transition-all"
                        />
                      </div>
                    </div>

                  </div>

                </div>

                {/* Special Dietary notes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block pl-1">Special Accommodations / Dietary Notes / Celebration Plans</label>
                  <div className="relative">
                    <Compass className="absolute left-3.5 top-4 text-neutral-450 w-4 h-4 pointer-events-none" />
                    <textarea
                      id="input-res-notes"
                      placeholder="e.g. Anniversary dinner. Please accommodate gluten allergy. Prefer a soft acoustic desk..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      className="w-full bg-neutral-950 border border-neutral-850 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-xs pl-10 pr-4 py-3.5 text-neutral-500 placeholder-neutral-450 focus:outline-none font-sans font-normal resize-none rounded-xl transition-all"
                    />
                  </div>
                </div>

                {/* Fine dining terms confirmation */}
                <div className="border border-gold-500/20 p-4 bg-gold-500/[0.02] rounded-xl flex gap-3 text-[11px] text-neutral-500 leading-relaxed font-sans font-medium">
                  <CheckCircle className="w-5 h-5 text-gold-500 shrink-0" />
                  <div>
                    <span className="text-gold-600 font-semibold uppercase tracking-wider block mb-0.5">Bespoke Reservation Standards:</span> A cancellation fee of €50 per person applies for tables modified within 48 hours. Proper elegant/formal dress is requested in our Grande Salle Salon.
                  </div>
                </div>

                {/* Confirm action button */}
                <button
                  id="btn-confirm-booking"
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-600 text-neutral-100 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer hover:shadow-gold-500/10 rounded-full"
                >
                  Verify & Request Reserved Table
                </button>

              </form>

            </div>
          </div>

          {/* RIGHT: Confirmed Ticket Display & Lookup search engine */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Ticket Lookup Console */}
            <div className="glass-card p-5 border border-neutral-850 bg-neutral-950 rounded-2xl shadow-md">
              <span className="text-[10px] text-neutral-500 font-sans font-semibold uppercase tracking-widest block mb-4 pl-1">Query Confirmed Invitations</span>
              <form id="lookup-form" onSubmit={lookupBooking} className="flex gap-2">
                <input
                  id="input-lookup-code"
                  type="text"
                  placeholder="e.g. ECLAT-A9FE-2026"
                  required
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-850 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-xs px-3.5 py-3 font-mono text-neutral-500 rounded-xl focus:outline-none"
                />
                <button
                  id="btn-search-booking"
                  type="submit"
                  className="px-5 bg-neutral-950 border border-gold-500/20 hover:border-gold-500 text-gold-500 hover:text-white transition-all text-xs font-mono flex items-center justify-center cursor-pointer rounded-xl hover:bg-gold-500"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
              
              {searchError && (
                <p className="text-[10px] text-red-500 font-mono mt-2 pl-1">⚠ {searchError}</p>
              )}
            </div>

            {/* SEAT INVITATION TICKET PRINT-OUT */}
            <AnimatePresence mode="popLayout">
              {/* Dynamic booked receipt ticket or searched booking receipt ticket */}
              {(confirmedReservation || searchedRes) && (
                (() => {
                  const dataObj = searchedRes || confirmedReservation;
                  if (!dataObj) return null;
                  const isCancelled = dataObj.status === 'cancelled';

                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass-card p-6 border border-neutral-850 bg-neutral-950 relative overflow-hidden shadow-md rounded-2xl"
                    >
                      {/* Ticket tear strip graphic */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-500/10 via-gold-500/40 to-gold-500/10" />

                      {/* Cancelled overstamp block */}
                      {isCancelled && (
                        <div className="absolute inset-0 bg-red-950/10 backdrop-blur-[1px] flex items-center justify-center z-20 pointer-events-none rounded-2xl">
                          <div className="transform -rotate-12 border-4 border-red-500 text-red-500 text-2xl font-bold uppercase tracking-widest px-6 py-2">
                            Cancelled
                          </div>
                        </div>
                      )}

                      {/* Invitation Ticket Header */}
                      <div className="text-center pb-6 border-b border-dashed border-neutral-850 relative">
                        <div className="w-10 h-10 mx-auto bg-neutral-950 border border-gold-500/25 flex items-center justify-center p-2 mb-3 text-gold-500 rounded-xl">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] text-gold-500 font-sans font-semibold uppercase tracking-[0.3em] block">Fine Dining Invitation</span>
                        <h4 className="text-neutral-200 font-serif text-xl uppercase font-bold mt-1">L'ÉCLAT PARIS</h4>
                        <span className="text-[9px] text-neutral-500 font-sans font-medium mt-1.5 block">Confirmation Code</span>
                        <span className="text-xs text-neutral-200 font-mono font-bold bg-neutral-950 px-4 py-1.5 border border-neutral-850 mt-1 inline-block select-all rounded-lg">
                          {dataObj.id}
                        </span>
                      </div>

                      {/* Ticket stats body */}
                      <div className="py-6 space-y-4 text-xs font-sans text-neutral-500 font-medium">
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block">Primary Guest</span>
                            <span className="text-neutral-200 font-semibold text-sm">{dataObj.name}</span>
                          </div>
                          <div className="space-y-0.5 text-right">
                            <span className="text-[9px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block">Party size</span>
                            <span className="text-neutral-200 font-bold font-serif text-sm">{dataObj.guests} Guest{dataObj.guests > 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block">Date</span>
                            <span className="text-neutral-200 font-semibold">{dataObj.date}</span>
                          </div>
                          <div className="space-y-0.5 text-right">
                            <span className="text-[9px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block">Dining Hour</span>
                            <span className="text-gold-500 font-mono font-bold text-sm">{dataObj.time} PM</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block">Dining Salon</span>
                            <span className="text-neutral-200 font-semibold">
                              {dataObj.tableType === 'standard' && 'La Grande Salle'}
                              {dataObj.tableType === 'window' && 'Le Marais Window View'}
                              {dataObj.tableType === 'chef-table' && 'The Chef\'s Pass'}
                              {dataObj.tableType === 'private-alcove' && 'The Private Suite'}
                            </span>
                          </div>
                          <div className="space-y-0.5 text-right flex flex-col items-end">
                            <span className="text-[9px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block">Invitation Status</span>
                            <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border font-mono rounded-full ${
                              isCancelled 
                                ? 'bg-red-500/10 border-red-500 text-red-500' 
                                : 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                            }`}>
                              {dataObj.status}
                            </span>
                          </div>
                        </div>

                        {dataObj.specialRequests && (
                          <div className="pt-3 border-t border-neutral-850 space-y-1">
                            <span className="text-[9px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block">Special Accommodations</span>
                            <p className="text-neutral-500 font-sans italic text-[11px] leading-relaxed">
                              "{dataObj.specialRequests}"
                            </p>
                          </div>
                        )}

                        <div className="pt-3 border-t border-neutral-850 space-y-1">
                          <span className="text-[9px] text-neutral-500 font-sans font-semibold uppercase tracking-wider block">Contact Registered</span>
                          <p className="text-neutral-500 text-[10px] font-mono leading-relaxed">
                            {dataObj.email} <br />
                            {dataObj.phone}
                          </p>
                        </div>

                        {/* Barcode scanner display */}
                        <div className="pt-4 border-t border-neutral-850 flex flex-col items-center gap-1.5">
                          <span className="text-[8px] text-neutral-500 font-sans font-semibold tracking-widest uppercase">SCAN AT CONCIERGE DESK</span>
                          <div className="flex gap-[2px] h-8 justify-center items-stretch w-full max-w-[200px] select-none">
                            {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 2, 1, 3].map((width, idx) => (
                              <div 
                                key={idx} 
                                className="bg-neutral-500" 
                                style={{ width: `${width}px` }} 
                              />
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Footer credentials */}
                      <div className="pt-4 border-t border-dashed border-neutral-850 flex justify-between items-center text-[10px] text-neutral-500 font-mono relative">
                        {/* Circular punch out notch graphics left/right */}
                        <div className="absolute -left-8 -top-2 w-4 h-4 bg-neutral-950 rounded-full border border-neutral-850" />
                        <div className="absolute -right-8 -top-2 w-4 h-4 bg-neutral-950 rounded-full border border-neutral-850" />

                        <span>PLACE DES VOSGES</span>
                        <span>L'ÉCLAT EXECUTIVE BRIGADE</span>
                      </div>

                      {/* Cancel table trigger */}
                      {!isCancelled && (
                        <button
                          id={`btn-cancel-res-${dataObj.id}`}
                          onClick={() => handleCancelBooking(dataObj.id)}
                          className="mt-6 w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500 text-red-500 hover:text-red-600 text-[10px] font-sans font-bold uppercase tracking-widest transition-all cursor-pointer rounded-full"
                        >
                          Cancel Table Booking
                        </button>
                      )}

                    </motion.div>
                  );
                })()
              )}
            </AnimatePresence>

            {/* RESERVATION HISTORY LEDGER CARD */}
            <div className="glass-card p-6 border border-neutral-850 bg-neutral-950 rounded-2xl shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4 h-4 text-gold-500 animate-pulse" />
                <span className="text-[11px] text-neutral-200 font-serif font-bold uppercase tracking-wider block">Your Dining Ledger</span>
              </div>
              <p className="text-neutral-500 font-sans text-xs font-normal leading-relaxed mb-5">
                View upcoming appointments and historical dining collections. Select an entry to print or view details.
              </p>

              {/* History Tabs */}
              <div className="flex gap-1 mb-5 border-b border-neutral-850 pb-3">
                {(['all', 'upcoming', 'past'] as const).map(tab => (
                  <button
                    key={tab}
                    id={`btn-history-tab-${tab}`}
                    type="button"
                    onClick={() => setHistoryTab(tab)}
                    className={`py-1.5 px-3 text-[9px] tracking-wider uppercase font-sans font-semibold transition-all text-center border cursor-pointer rounded-full ${
                      historyTab === tab
                        ? 'border-gold-500 bg-gold-500/10 text-gold-500 shadow-sm'
                        : 'border-transparent text-neutral-500 hover:text-gold-500 hover:bg-gold-500/5'
                    }`}
                  >
                    {tab === 'all' && 'All'}
                    {tab === 'upcoming' && 'Upcoming'}
                    {tab === 'past' && 'Past'}
                  </button>
                ))}
              </div>

              {/* Ledger List */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar style-scrollbar">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-neutral-850 rounded-xl">
                    <span className="text-[9px] font-sans font-semibold text-neutral-500 uppercase tracking-widest block">No matching soirees found</span>
                  </div>
                ) : (
                  filteredHistory.map((item) => {
                    const isUpcoming = item.date >= '2026-06-06';
                    const isCancelled = item.status === 'cancelled';
                    const isPast = !isUpcoming;
                    
                    return (
                      <div
                        key={item.id}
                        className={`p-4 border transition-all rounded-xl ${
                          (searchedRes?.id === item.id || confirmedReservation?.id === item.id)
                            ? 'border-gold-500 bg-gold-500/5 shadow-md'
                            : 'border-neutral-850 hover:border-neutral-500/30 bg-neutral-950 shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <span className="text-xs text-neutral-200 font-serif font-bold block leading-none">
                              {item.tableType === 'standard' && 'La Grande Salle'}
                              {item.tableType === 'window' && 'Le Marais Window View'}
                              {item.tableType === 'chef-table' && 'The Chef\'s Pass'}
                              {item.tableType === 'private-alcove' && 'The Private Suite'}
                            </span>
                            <span className="text-[9px] font-mono text-neutral-500 block">
                              {item.date} @ {item.time} PM
                            </span>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1">
                            <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border font-sans rounded-full ${
                              isCancelled
                                ? 'bg-red-500/10 border-red-500/30 text-red-500'
                                : isPast
                                ? 'bg-neutral-950 border-neutral-850 text-neutral-550'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                            }`}>
                              {isCancelled ? 'Cancelled' : isPast ? 'Past' : 'Upcoming'}
                            </span>
                            <span className="text-[9px] text-neutral-500 font-mono font-medium">
                              {item.guests} Guest{item.guests > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {/* Extra minor stats & action details line */}
                        <div className="mt-3 pt-2.5 border-t border-neutral-850 flex justify-between items-center gap-2">
                          <span className="text-[8px] text-neutral-500 font-mono tracking-wider truncate max-w-[120px] select-all font-semibold">
                            {item.id}
                          </span>
                          
                          <div className="flex gap-1.5">
                            <button
                              id={`btn-inspect-ledger-${item.id}`}
                              type="button"
                              onClick={() => {
                                setSearchedRes(item);
                                if (confirmedReservation?.id === item.id) {
                                  // keep sync
                                } else {
                                  setConfirmedReservation(null);
                                }
                              }}
                              className="px-3 py-1 bg-neutral-950 hover:bg-gold-500 hover:text-white border border-neutral-850 hover:border-gold-500 text-gold-500 text-[8px] font-sans font-bold uppercase tracking-widest cursor-pointer transition-all rounded-full"
                            >
                              Inspect Ticket
                            </button>
                            
                            {isUpcoming && !isCancelled && (
                              <button
                                id={`btn-cancel-ledger-${item.id}`}
                                type="button"
                                onClick={() => handleCancelBooking(item.id)}
                                className="px-3 py-1 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 text-red-500 text-[8px] font-sans font-bold uppercase tracking-widest cursor-pointer transition-all rounded-full"
                              >
                                Cancel Table
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
