import { motion } from 'motion/react';
import { X, Calendar, Compass, MapPin, Map, HelpCircle, Phone, ArrowLeft } from 'lucide-react';
import { Destination } from '../types';
import BookingForm from './BookingForm';
import LazyImage from './LazyImage';

interface DestinationModalProps {
  destination: Destination;
  onClose: () => void;
}

export default function DestinationModal({ destination, onClose }: DestinationModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
    >
      {/* Container */}
      <motion.div
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        className="bg-[#0B1120] w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl shadow-black border border-slate-800 max-h-[90vh] flex flex-col"
      >
        {/* Banner Header */}
        <div className="relative h-60 md:h-72 shrink-0">
          <LazyImage
            src={destination.bannerImage}
            alt={destination.title}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>
          
          {/* Top buttons */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <button
              onClick={onClose}
              className="bg-slate-900/90 hover:bg-slate-800 text-white p-2.5 rounded-full cursor-pointer transition shadow-md flex items-center gap-1.5 text-xs font-bold border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 text-brand-yellow" /> Back to Home
            </button>
            <button
              onClick={onClose}
              className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full cursor-pointer transition border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Slogan and title */}
          <div className="absolute bottom-6 left-6 right-6 text-white z-10">
            <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-yellow-400 bg-yellow-450/10 px-3 py-1 rounded-full border border-yellow-400/20">
              {destination.slogan}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans tracking-tight mt-3">
              {destination.title} Tour Taxi Package
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs md:text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-brand-yellow" /> Approx. {destination.distanceKm / 2} km from Coimbatore
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-400" /> Best Time: {destination.bestTimeToVisit}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="overflow-y-auto p-6 md:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Place Details & Sightseeing */}
            <div className="lg:col-span-7 space-y-8">
              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-brand-yellow" /> Experience {destination.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {destination.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {destination.highlights.map((h, idx) => (
                    <span 
                      key={idx}
                      className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-medium px-3 py-1 rounded-full text-xs"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Graphical Route Indicator using SVG */}
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Map className="w-3.5 h-3.5" /> Visual Route & Distance Indicator
                  </h4>
                  <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded-md text-gray-400 border border-slate-800/60">
                    Direct Hill Route Map
                  </span>
                </div>
                
                <div className="relative flex items-center justify-between px-6 py-4 bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800/60">
                  {/* Glowing connector line (SVG) */}
                  <div className="absolute inset-x-12 top-[42px] h-6 pointer-events-none">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Gradient background path */}
                      <path
                        d="M 10 12 Q 100 2, 200 12 T 390 12"
                        stroke="#1E293B"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      {/* Active glowing path */}
                      <path
                        d="M 10 12 Q 100 2, 200 12 T 390 12"
                        stroke="url(#modal-route-grad)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="5 5"
                        className="animate-pulse"
                      />
                      {/* Animated traveling dot */}
                      <circle cx="10" cy="12" r="4.5" fill="#FFC107" className="shadow-lg">
                        <animate
                          attributeName="cx"
                          values="10;100;200;300;390"
                          dur="5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <defs>
                        <linearGradient id="modal-route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="50%" stopColor="#6366F1" />
                          <stop offset="100%" stopColor="#FFC107" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Start Point */}
                  <div className="flex flex-col items-center z-10 text-center w-28">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                      CJB
                    </div>
                    <span className="text-xs font-black text-white mt-1.5">Coimbatore</span>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider">Start point</span>
                  </div>

                  {/* Scenic Midpoint */}
                  <div className="flex flex-col items-center z-10 text-center w-24 opacity-80">
                    <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-400/80 flex items-center justify-center text-indigo-300 font-mono text-[9px] font-bold">
                      WAY
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 mt-1.5">Western Ghats</span>
                    <span className="text-[8px] text-gray-400 uppercase tracking-widest">Scenic Drive</span>
                  </div>

                  {/* Destination End Point */}
                  <div className="flex flex-col items-center z-10 text-center w-28">
                    <div className="w-9 h-9 rounded-full bg-yellow-400/10 border-2 border-yellow-400 flex items-center justify-center text-yellow-400 font-mono text-xs font-bold shadow-[0_0_12px_rgba(255,193,7,0.4)]">
                      DST
                    </div>
                    <span className="text-xs font-black text-white mt-1.5">{destination.title}</span>
                    <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-wider">Approx. {destination.distanceKm / 2} Km</span>
                  </div>
                </div>
              </div>

              {/* Sightseeing Guide */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-brand-yellow" /> Main Sightseeing Attractions
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.sightseeing.map((spot, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm space-y-1.5 hover:border-yellow-400/40 transition"
                    >
                      <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 bg-yellow-400/10 rounded-full flex items-center justify-center text-[10px] text-brand-yellow font-mono font-bold">
                          {idx + 1}
                        </span>
                        {spot.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {spot.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why choose Get Taxi Kovai */}
              <div className="bg-slate-900/40 text-white p-5 rounded-2xl space-y-3 border border-slate-800">
                <h4 className="font-bold text-sm text-brand-yellow">Why Travel to {destination.title} With Us?</h4>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-yellow shrink-0">✔</span>
                    <span><strong>Experienced Hill Drivers:</strong> Specialized chauffeurs who negotiate hairpins safely and acts as friendly tourist guides.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-yellow shrink-0">✔</span>
                    <span><strong>Flexible Itinerary:</strong> Enjoy freedom to stop for tea, scenic valleys, or photographs as you please.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-yellow shrink-0">✔</span>
                    <span><strong>Instant Support:</strong> Dial +91 9043743777 anytime for rapid dispatch and on-trip assistance.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Pre-loaded Calculator & Booking Form */}
            <div className="lg:col-span-5">
              <div className="sticky top-0 space-y-4">
                <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-2xl text-xs text-brand-yellow flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Exclusive {destination.title} Package Pricing</span>
                    Your custom travel fare has been pre-configured below. Don't worry about complex per-km math. View the exact final fare and submit to lock it down!
                  </div>
                </div>

                {/* Pre-loaded Booking form */}
                <BookingForm 
                  initialDestinationId={destination.id} 
                  onSuccess={() => {
                    // Handled inside BookingForm, can add more actions
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
