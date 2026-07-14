import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Calendar, Shield, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'bookings' | 'pricing' | 'safety';
}

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'bookings' | 'pricing' | 'safety'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      category: 'bookings',
      question: 'How do I book an outstation taxi with Get Taxi Kovai?',
      answer: 'Booking is simple and fast. You can use our real-time interactive fare estimator on this page to submit an inquiry, call our 24/7 support line at +91 9043743777, or send us a WhatsApp message. Our dispatch team will confirm your vehicle allocation and schedule immediately with zero paperwork.'
    },
    {
      category: 'bookings',
      question: 'Can I cancel or reschedule my scheduled trip?',
      answer: 'Yes, we provide 100% free cancellations and modifications up to 12 hours before your scheduled pickup time. There are no penalty charges. To cancel or change your dates, simply contact our booking desk on +91 9043743777.'
    },
    {
      category: 'pricing',
      question: 'Are there any hidden fees, toll overheads, or night surcharges?',
      answer: 'Absolutely not. Get Taxi Kovai operates on strict transparency rules. The fare displayed on our dynamic estimator is the final, all-inclusive price. It incorporates fuel, standard driver allowances (beta), and state permit costs. Standard toll booth fees and parking charges are settled clearly based on actual receipts, without markup.'
    },
    {
      category: 'pricing',
      question: 'What is the "Driver Beta" and do I pay it separately?',
      answer: 'The Driver Beta (also known as driver bhatta) is a daily allowance of Rs. 500 for the chauffeur\'s food and lodging during long-distance or overnight journeys. For your peace of mind, this is already fully calculated and embedded in your final estimated fare. You do not have to pay the driver separately or negotiate allowances.'
    },
    {
      category: 'safety',
      question: 'How safe are the hill station drives (Ooty, Munnar, Valparai)?',
      answer: 'Safety is our absolute highest priority. Traversing the 40 hairpin curves of Valparai or steep mountain climbs of Ooty requires specialized skill. All our outstation chauffeurs are extensively certified, vetted, and have at least 5+ years of active experience driving in the Western Ghats. Cabs are driven at safe, regulated speeds.'
    },
    {
      category: 'safety',
      question: 'What are your vehicle hygiene and sanitation standards?',
      answer: 'We maintain an immaculate fleet. Every vehicle undergoes a detailed multi-point inspection, thorough wash, and complete interior cabin vacuuming and sanitization before being dispatched for a new booking. AC filters are cleaned regularly to ensure fresh air circulation throughout your trip.'
    }
  ];

  const filteredItems = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div id="faq-section" className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 md:p-8 space-y-6 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" /> FAQ Helpdesk
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-950 font-sans tracking-tight">
            Common Inquiries Answered
          </h3>
          <p className="text-xs text-gray-500">
            Have questions about billing transparency, route safety, or bookings? We have answers.
          </p>
        </div>

        {/* Instant Search Bar */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-900 transition font-medium"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-gray-100 pb-2">
        <button
          onClick={() => { setActiveCategory('all'); setOpenIndex(null); }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeCategory === 'all' 
              ? 'bg-slate-950 text-white shadow-xs' 
              : 'text-gray-500 hover:text-slate-950 hover:bg-slate-50'
          }`}
        >
          All Questions
        </button>
        <button
          onClick={() => { setActiveCategory('bookings'); setOpenIndex(null); }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'bookings' 
              ? 'bg-indigo-600 text-white shadow-xs' 
              : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Bookings
        </button>
        <button
          onClick={() => { setActiveCategory('pricing'); setOpenIndex(null); }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'pricing' 
              ? 'bg-yellow-500 text-slate-950 shadow-xs' 
              : 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-50/50'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" /> Pricing Transparency
        </button>
        <button
          onClick={() => { setActiveCategory('safety'); setOpenIndex(null); }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'safety' 
              ? 'bg-emerald-600 text-white shadow-xs' 
              : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Vehicle Safety
        </button>
      </div>

      {/* Accordion Questions */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">
            No matching FAQs found. Try searching for other terms like "safety", "Beta", "Ooty" or call +91 9043743777.
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`border rounded-2xl transition duration-150 overflow-hidden ${
                  isOpen 
                    ? 'border-slate-300 bg-slate-50/30' 
                    : 'border-gray-150 hover:border-gray-300 bg-white'
                }`}
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full text-left p-4 md:p-5 flex justify-between items-center gap-4 cursor-pointer focus:outline-hidden"
                >
                  <span className="font-extrabold text-xs md:text-sm text-slate-900 leading-snug">
                    {item.question}
                  </span>
                  <span className={`p-1.5 rounded-lg shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-100 text-gray-500'
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 md:px-5 pb-5 pt-0 border-t border-gray-100 mt-0 text-xs md:text-sm text-gray-600 leading-relaxed text-left">
                        <div className="pt-4 font-medium text-gray-600">
                          {item.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Trust Quote footer inside FAQ */}
      <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 text-left">
        <span className="text-2xl">⚡</span>
        <div className="text-xs">
          <span className="font-bold text-slate-900">Have a specific or customized route itinerary?</span>{' '}
          <span className="text-gray-500">Our customer support can help you tailor custom drop-offs or sightseeing targets. Reach us 24/7 at </span>
          <a href="tel:9043743777" className="text-indigo-600 hover:underline font-bold">+91 9043743777</a>.
        </div>
      </div>
    </div>
  );
}
