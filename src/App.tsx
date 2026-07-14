import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, MessageSquare, Car, MapPin, Award, Shield, 
  Clock, Navigation, ChevronRight, Menu, HelpCircle, 
  Settings, ClipboardList, Info, ThumbsUp, Calendar,
  BookOpen, Home, X, Compass, Minimize2
} from 'lucide-react';
import { DESTINATIONS, VEHICLES, BLOGS } from './data';
import { Destination, Inquiry, BlogPost } from './types';
import BookingForm from './components/BookingForm';
import DestinationModal from './components/DestinationModal';
import InquiryList from './components/InquiryList';
import AIAssistant from './components/AIAssistant';
import FAQ from './components/FAQ';
import LocalGeoHubs from './components/LocalGeoHubs';
import LazyImage from './components/LazyImage';

export default function App() {
  // Modal & Drawer States
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [lastInquiry, setLastInquiry] = useState<Inquiry | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefilledDestId, setPrefilledDestId] = useState<string | undefined>(undefined);

  const handleSelectPackage = (id: string) => {
    setPrefilledDestId(id);
    scrollToCalculator();
  };

  // Parse deep-linked packages or blogs via URL parameters or hashes on page load
  useEffect(() => {
    const handleUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const destId = params.get('dest');
      const blogId = params.get('blog');

      if (destId) {
        const dest = DESTINATIONS.find(d => d.id === destId);
        if (dest) {
          setSelectedDest(dest);
        }
      } else if (blogId) {
        const blog = BLOGS.find(b => b.id === blogId);
        if (blog) {
          setSelectedBlog(blog);
        }
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          const dest = DESTINATIONS.find(d => d.id === hash);
          if (dest) {
            setSelectedDest(dest);
          }
        }
      }
    };

    // Run on initial load with a slight delay to allow smooth rendering
    const timer = setTimeout(handleUrlParams, 200);

    window.addEventListener('hashchange', handleUrlParams);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', handleUrlParams);
    };
  }, []);

  // Dynamic SEO Meta Tags for Coimbatore Taxi, Ooty Tour Package, Premium Cabs & elite GEO/SEO
  useEffect(() => {
    // Page Title
    document.title = "Get Taxi Kovai | Coimbatore Taxi & Ooty Tour Package Premium Cabs";

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Book premium cabs with Get Taxi Kovai. Best Coimbatore Taxi service for Ooty Tour Package, Munnar Sightseeing, and hourly rental. Secure professional drivers, no hidden fees, instant transparent pricing.');

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'Coimbatore Taxi, Ooty Tour Package, Premium Cabs, Coimbatore cab booking, Adiyogi taxi, Munnar cab service, Kodaikanal travel, outstation taxi Coimbatore');

    // OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', 'Get Taxi Kovai | Coimbatore Taxi, Ooty Tour Package & Premium Cabs');

    // OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', 'Best Coimbatore Taxi service for Ooty Tour Packages & Premium outstation cabs. Safe mountain driving with pristine premium vehicles.');

    // Inject SEO Schema JSON-LD dynamically
    const taxiSchemaId = 'seo-taxi-schema';
    const faqSchemaId = 'seo-faq-schema';

    // Remove existing if any
    document.getElementById(taxiSchemaId)?.remove();
    document.getElementById(faqSchemaId)?.remove();

    const taxiScript = document.createElement('script');
    taxiScript.id = taxiSchemaId;
    taxiScript.type = 'application/ld+json';
    taxiScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "name": "Get Taxi Kovai",
      "description": "Coimbatore's premium taxi service. Book outstation cabs, Ooty tour packages, Munnar sightseeing, Adiyogi travel and local hourly rentals with elite cars.",
      "url": "https://gettaxikovai.in",
      "telephone": "+919043743777",
      "priceRange": "INR",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Get Taxi Kovai",
        "image": "https://gettaxikovai.in/images/logo.png",
        "telephone": "+919043743777",
        "priceRange": "INR",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Coimbatore Cab Division, Gandhipuram",
          "addressLocality": "Coimbatore",
          "addressRegion": "Tamil Nadu",
          "postalCode": "641012",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "11.0168",
          "longitude": "76.9558"
        }
      },
      "areaServed": [
        { "@type": "AdministrativeArea", "name": "Coimbatore" },
        { "@type": "AdministrativeArea", "name": "Ooty" },
        { "@type": "AdministrativeArea", "name": "Munnar" },
        { "@type": "AdministrativeArea", "name": "Kodaikanal" },
        { "@type": "AdministrativeArea", "name": "Valparai" },
        { "@type": "AdministrativeArea", "name": "Adiyogi Shiva Temple" }
      ],
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "description": "Premium cab rides starting from standard competitive local rates with zero surge pricing."
      }
    });
    document.head.appendChild(taxiScript);

    const faqScript = document.createElement('script');
    faqScript.id = faqSchemaId;
    faqScript.type = 'application/ld+json';
    faqScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I book an outstation taxi with Get Taxi Kovai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Booking is simple and fast. You can use our real-time interactive fare estimator on this page to submit an inquiry, call our 24/7 support line at +91 9043743777, or send us a WhatsApp message. Our dispatch team will confirm your vehicle allocation and schedule immediately with zero paperwork."
          }
        },
        {
          "@type": "Question",
          "name": "Can I cancel or reschedule my scheduled trip?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we provide 100% free cancellations and modifications up to 12 hours before your scheduled pickup time. There are no penalty charges. To cancel or change your dates, simply contact our booking desk on +91 9043743777."
          }
        },
        {
          "@type": "Question",
          "name": "Are there any hidden fees, toll overheads, or night surcharges?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely not. Get Taxi Kovai operates on strict transparency rules. The fare displayed on our dynamic estimator is the final, all-inclusive price. It incorporates fuel, standard driver allowances (beta), and state permit costs."
          }
        },
        {
          "@type": "Question",
          "name": "How safe are the hill station drives (Ooty, Munnar, Valparai)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Safety is our absolute highest priority. Traversing the 40 hairpin curves of Valparai or steep mountain climbs of Ooty requires specialized skill. All our outstation chauffeurs are extensively certified, vetted, and have at least 5+ years of active experience driving in the Western Ghats."
          }
        }
      ]
    });
    document.head.appendChild(faqScript);

    return () => {
      document.getElementById(taxiSchemaId)?.remove();
      document.getElementById(faqSchemaId)?.remove();
    };
  }, []);

  // Dynamic SEO & Twitter/OG Tags for selected blog post
  useEffect(() => {
    if (selectedBlog) {
      // Store original values before changing
      const originalTitle = document.title;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';

      const ogTitle = document.querySelector('meta[property="og:title"]');
      const originalOgTitle = ogTitle ? ogTitle.getAttribute('content') : '';

      const ogDesc = document.querySelector('meta[property="og:description"]');
      const originalOgDesc = ogDesc ? ogDesc.getAttribute('content') : '';

      const ogImage = document.querySelector('meta[property="og:image"]');
      const originalOgImage = ogImage ? ogImage.getAttribute('content') : '';

      const ogType = document.querySelector('meta[property="og:type"]');
      const originalOgType = ogType ? ogType.getAttribute('content') : '';

      // Update values
      document.title = `${selectedBlog.title} | Get Taxi Kovai`;

      if (metaDesc) {
        metaDesc.setAttribute('content', selectedBlog.summary || selectedBlog.content[0]);
      }
      if (ogTitle) {
        ogTitle.setAttribute('content', selectedBlog.title);
      }
      if (ogDesc) {
        ogDesc.setAttribute('content', selectedBlog.summary || selectedBlog.content[0]);
      }
      if (ogImage) {
        ogImage.setAttribute('content', selectedBlog.image);
      }
      if (ogType) {
        ogType.setAttribute('content', 'article');
      }

      // Twitter tags dynamic management
      let twitterCard = document.querySelector('meta[name="twitter:card"]');
      if (!twitterCard) {
        twitterCard = document.createElement('meta');
        twitterCard.setAttribute('name', 'twitter:card');
        document.head.appendChild(twitterCard);
      }
      twitterCard.setAttribute('content', 'summary_large_image');

      let twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (!twitterTitle) {
        twitterTitle = document.createElement('meta');
        twitterTitle.setAttribute('name', 'twitter:title');
        document.head.appendChild(twitterTitle);
      }
      twitterTitle.setAttribute('content', selectedBlog.title);

      let twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (!twitterDesc) {
        twitterDesc = document.createElement('meta');
        twitterDesc.setAttribute('name', 'twitter:description');
        document.head.appendChild(twitterDesc);
      }
      twitterDesc.setAttribute('content', selectedBlog.summary || selectedBlog.content[0]);

      let twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterImage);
      }
      twitterImage.setAttribute('content', selectedBlog.image);

      // Return cleanup function to restore originals on unmount or state change
      return () => {
        document.title = originalTitle;
        if (metaDesc && originalDesc) metaDesc.setAttribute('content', originalDesc);
        if (ogTitle && originalOgTitle) ogTitle.setAttribute('content', originalOgTitle);
        if (ogDesc && originalOgDesc) ogDesc.setAttribute('content', originalOgDesc);
        if (ogImage && originalOgImage) ogImage.setAttribute('content', originalOgImage);
        if (ogType && originalOgType) ogType.setAttribute('content', originalOgType);
        
        twitterCard?.remove();
        twitterTitle?.remove();
        twitterDesc?.remove();
        twitterImage?.remove();
      };
    }
  }, [selectedBlog]);

  // Smooth scroll helpers
  const scrollToCalculator = () => {
    const el = document.getElementById('calculator-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFAQ = () => {
    const el = document.getElementById('faq-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBlogs = () => {
    const el = document.getElementById('blog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPackages = () => {
    const el = document.getElementById('packages-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLocalCoverage = () => {
    const el = document.getElementById('local-coverage-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const el = document.getElementById('footer-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerAIChat = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  const openDestination = (id: string) => {
    const dest = DESTINATIONS.find(d => d.id === id);
    if (dest) {
      setSelectedDest(dest);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col font-sans antialiased selection:bg-brand-yellow selection:text-slate-950 pb-20 md:pb-0">
      {/* AMBER & WHITE NEWS-STYLE SCROLLING TICKER MARQUEE */}
      <div className="bg-brand-yellow text-slate-950 py-2.5 px-4 text-xs font-black tracking-wide shrink-0 border-b border-brand-yellow-hover flex overflow-hidden relative select-none shadow-sm">
        <div className="whitespace-nowrap flex gap-12 items-center animate-marquee">
          <span>📢 GET TAXI KOVAI: COIMBATORE'S CHOSEN PREMIERE TAXI DIVISION</span>
          <span className="text-slate-950 font-extrabold">•</span>
          <span>🔥 ₹14/KM STARTING FARE</span>
          <span className="text-slate-950 font-extrabold">•</span>
          <span>⛰️ EXPERT HILL DRIVERS</span>
          <span className="text-slate-950 font-extrabold">•</span>
          <span>🛡️ ZERO HIDDEN FEES</span>
          <span className="text-slate-950 font-extrabold">•</span>
          <span>📞 TOUR BOOKINGS & DISPATCH HELPLINE: +91 90437 43777</span>
          <span className="text-slate-950 font-extrabold">•</span>
          <span>🏔️ SIGHTSEEING TOUR PACKAGES: OOTY, MUNNAR, KODAIKANAL, VALPARAI & ADIYOGI SHIVA</span>
          <span className="text-slate-950 font-extrabold">•</span>
          <span>⚡ 100% RELIABLE DRIVERS • NO SURGES OR HIDDEN CHARGES</span>
          <span className="text-slate-950 font-extrabold">•</span>
          <span>🚕 IMMACULATE FLEET: SEDANS, ERTIGA, INNOVA CRYSTA & HYCROSS</span>
          <span className="text-slate-950 font-extrabold">•</span>
        </div>
        <div className="absolute top-0 right-0 bottom-0 bg-gradient-to-l from-brand-yellow via-transparent to-transparent w-8 z-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-brand-yellow via-transparent to-transparent w-8 z-10 pointer-events-none"></div>
      </div>

      {/* HEADER SECTION - 100% Transparent & Sticky */}
      <header className="sticky top-0 z-50 w-full bg-[#0B1120]/10 backdrop-blur-md border-b border-white/5 py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-slate-950 shadow-lg font-extrabold shrink-0 hover:scale-105 active:scale-95 transition-transform duration-150">
              <span className="text-xl">🚕</span>
            </div>
            <h1 className="font-extrabold text-sm md:text-base tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
              GET <span className="text-brand-yellow">TAXI KOVAI</span>
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
            <button onClick={scrollToCalculator} className="hover:text-brand-yellow hover:scale-105 active:scale-95 transition-all cursor-pointer">Pricing Calculator</button>
            <button onClick={scrollToPackages} className="hover:text-brand-yellow hover:scale-105 active:scale-95 transition-all cursor-pointer">Tour Packages</button>
            <button onClick={scrollToLocalCoverage} className="hover:text-brand-yellow hover:scale-105 active:scale-95 transition-all cursor-pointer">Local Hubs</button>
            <button onClick={scrollToBlogs} className="hover:text-brand-yellow hover:scale-105 active:scale-95 transition-all cursor-pointer">Travel Blogs</button>
            <button onClick={scrollToFAQ} className="hover:text-brand-yellow hover:scale-105 active:scale-95 transition-all cursor-pointer">FAQ</button>
            <button onClick={scrollToContact} className="hover:text-brand-yellow hover:scale-105 active:scale-95 transition-all cursor-pointer">Contact Us</button>
          </nav>

          {/* Desktop Nav Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* SEO Mobile Number for Google Crawler Visibility */}
            <a
              href="tel:9043743777"
              className="flex items-center gap-1.5 text-xs font-black text-white hover:text-brand-yellow transition duration-150"
            >
              <Phone className="w-3.5 h-3.5 text-brand-yellow shrink-0 animate-pulse" />
              <span className="tracking-wide">+91 90437 43777</span>
            </a>

            <a
              href="tel:9043743777"
              className="hidden sm:flex items-center gap-1.5 bg-brand-yellow hover:bg-brand-yellow-hover text-slate-950 py-2 px-4 rounded-full text-xs font-black transition duration-150 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              Call Helpline
            </a>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-white/5 hover:bg-white/10 text-white rounded-full transition cursor-pointer border border-white/10 hover:scale-105 active:scale-95"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="lg:hidden bg-brand-card/95 border-b border-white/10 text-white w-full z-20 overflow-hidden shrink-0 backdrop-blur-md"
          >
            <div className="px-6 pt-6 pb-8 space-y-6">
              {/* Premium Mobile Menu Header with explicit Close / Minimize button */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚕</span>
                  <span className="font-extrabold text-xs text-brand-yellow tracking-wider uppercase">Menu Navigation</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 bg-brand-dark/80 hover:bg-brand-dark text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-black transition duration-150 cursor-pointer shadow-sm"
                  title="Minimize Menu"
                >
                  <Minimize2 className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>CLOSE MENU</span>
                </button>
              </div>

              <div className="flex flex-col space-y-2 text-left">
                {[
                  { name: "Pricing Calculator", icon: <Car className="w-4 h-4 text-brand-yellow" />, action: scrollToCalculator },
                  { name: "Tour Packages", icon: <Compass className="w-4 h-4 text-brand-yellow" />, action: scrollToPackages },
                  { name: "Local Hubs", icon: <MapPin className="w-4 h-4 text-brand-yellow" />, action: scrollToLocalCoverage },
                  { name: "Travel Blogs", icon: <BookOpen className="w-4 h-4 text-brand-yellow" />, action: scrollToBlogs },
                  { name: "FAQ", icon: <HelpCircle className="w-4 h-4 text-brand-yellow" />, action: scrollToFAQ },
                  { name: "Contact Us", icon: <Phone className="w-4 h-4 text-brand-yellow" />, action: scrollToContact }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      item.action();
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 transition duration-150 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-brand-yellow/10 transition-colors duration-150">
                        {item.icon}
                      </div>
                      <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors duration-150">{item.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-yellow group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>

              <div className="bg-brand-dark/80 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-brand-yellow uppercase tracking-wider">Book Over Phone</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Instant booking without internet</p>
                </div>
                <a
                  href="tel:9043743777"
                  className="flex items-center gap-1.5 bg-brand-yellow hover:bg-brand-yellow-hover text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <main className="flex-1 space-y-16 bg-[#0B1120]">

        {/* PREMIUM DARK HERO SECTION */}
        <section className="relative text-white pt-28 pb-60 px-4 md:px-8 text-center overflow-hidden border-b border-white/5 bg-slate-950">
          {/* High-quality cinematic background image with heavy dark gradient overlay */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/80 to-slate-950"></div>
          
          {/* Ambient blurred backdrop glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[140px] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            {/* 1. Top Badge */}
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 bg-slate-950/90 border border-white/10 px-5 py-2.5 rounded-full text-xs font-black tracking-wider uppercase text-brand-yellow shadow-2xl">
                <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse"></span>
                COIMBATORE'S TOP-RATED TRAVEL PARTNER
              </span>
            </motion.div>

            {/* 2. Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-tighter leading-[1.05] uppercase max-w-4xl mx-auto text-white">
                PREMIUM OUTSTATION & LOCAL <span className="text-brand-yellow">TAXI SERVICES</span> IN COIMBATORE
              </h2>
            </motion.div>

            {/* 3. Sub-headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
                Ride with Coimbatore’s most trusted fleet. We guarantee transparent pricing, expert hill-station chauffeurs, and immaculately clean vehicles for your safety and comfort.
              </p>
            </motion.div>

            {/* 4. Sleek Horizontally Scrolling Text Ticker Catchwords */}
            <motion.div 
              className="relative w-full max-w-2xl mx-auto overflow-hidden py-3 bg-white/5 border border-white/10 rounded-full select-none shadow-lg"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
            >
              {/* Fade masks */}
              <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-slate-950/80 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-slate-950/80 to-transparent z-10 pointer-events-none"></div>
              
              <div className="whitespace-nowrap flex gap-8 items-center animate-marquee">
                {Array(4).fill([
                  "Local Rides", "One-Way", "Outstations", "Airport Pickups", "Professional Verified Drivers"
                ]).flat().map((word, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-100 tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span>
                    <span>{word}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. The Floating Widget Section - Peeking Over the Hero */}
        <section id="calculator-section" className="relative z-20 max-w-4xl mx-auto px-4 -mt-36 sm:-mt-44 md:-mt-48 pb-4 scroll-mt-24">
          <BookingForm 
            initialDestinationId={prefilledDestId}
            onSuccess={(inq) => {
              setLastInquiry(inq);
            }}
          />
        </section>

        {/* POPULAR TOUR PACKAGES / TOP DESTINATIONS SECTION */}
        <section id="packages-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 py-12">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-brand-yellow uppercase tracking-widest bg-brand-yellow/10 border border-brand-yellow/20 px-3 py-1 rounded-full">
              Popular Tour Packages
            </span>
            <h3 className="text-3xl md:text-4xl font-black font-sans tracking-tight text-white">
              Top Outstation Destinations
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Experience elite travel from Coimbatore with professional chauffeurs. Click "Book Cab" to estimate dynamic fares instantly or "Sightseeing" to read detailed itineraries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(() => {
              const featuredIds = ['munnar', 'ooty', 'kodaikanal', 'coorg', 'wayanad', 'valparai', 'coonoor', 'mysore'];
              const featuredDestinations = featuredIds
                .map(id => DESTINATIONS.find(d => d.id === id))
                .filter(Boolean) as Destination[];

              return featuredDestinations.map((dest) => (
                <motion.div
                  key={dest.id}
                  whileHover={{ y: -8 }}
                  className="bg-slate-900/60 backdrop-blur-md rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 hover:border-brand-yellow/30 shadow-xl flex flex-col justify-between cursor-pointer group transition-all duration-300"
                  onClick={() => setSelectedDest(dest)}
                >
                  <div>
                    {/* Card Image */}
                    <div className="h-44 relative overflow-hidden">
                      <LazyImage 
                        src={dest.bannerImage} 
                        alt={dest.title} 
                        className="group-hover:scale-110 transition duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>
                      <span className="absolute bottom-3 left-3 bg-brand-yellow text-slate-950 font-black px-2 py-0.5 rounded-md text-[9px] tracking-wide uppercase z-10">
                        {dest.distanceKm / 2} KM EACH WAY
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <span className="text-[9px] font-bold text-brand-yellow uppercase tracking-wider block">
                        {dest.slogan}
                      </span>
                      <h4 className="font-extrabold text-base text-white font-sans tracking-tight group-hover:text-brand-yellow transition line-clamp-1">
                        {dest.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                        {dest.description}
                      </p>
                      
                      {/* Sights highlight preview */}
                      <div className="space-y-1.5 pt-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Includes:</span>
                        <div className="flex flex-wrap gap-1">
                          {dest.highlights.slice(0, 2).map((h, idx) => (
                            <span key={idx} className="bg-white/5 text-slate-200 border border-white/5 px-2 py-0.5 rounded text-[9px] font-medium whitespace-nowrap">
                              • {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPackage(dest.id);
                      }}
                      className="flex-1 bg-brand-yellow hover:bg-brand-yellow-hover text-slate-950 font-black py-2 rounded-xl text-[11px] transition text-center cursor-pointer shadow-md"
                    >
                      Book Cab
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDest(dest);
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-white/5 font-bold py-2 rounded-xl text-[11px] transition text-center cursor-pointer"
                    >
                      Sightseeing
                    </button>
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        </section>

        {/* TRUSTED VALUE PROPOSITIONS */}
        <section className="bg-brand-card text-white py-16 px-4 md:px-8 rounded-3xl border border-white/5 max-w-7xl mx-auto">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="space-y-3 text-left">
                <div className="w-12 h-12 bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl flex items-center justify-center text-brand-yellow">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base tracking-tight">Zero Hidden Tariffs</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We strictly believe in absolute clarity. We do not display confusing per-km formulas. Our interactive tools provide full, all-inclusive quotes up front, containing driver bhatta.
                </p>
              </div>

              <div className="space-y-3 text-left">
                <div className="w-12 h-12 bg-emerald-400/10 border border-emerald-400/20 rounded-2xl flex items-center justify-center text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base tracking-tight">Expert Hill Chauffeurs</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Tackling the steep hairpins of Valparai or Ooty requires seasoned hands. All our drivers are extensively certified, polite, and specialize in Western Ghats tourism.
                </p>
              </div>

              <div className="space-y-3 text-left">
                <div className="w-12 h-12 bg-indigo-400/10 border border-indigo-400/20 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base tracking-tight">Punctual & 24/7 Active</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Whether catching an early 4 AM airport flight or arriving on a late-night train, our cabs are dispatched immediately with real-time support on +91 9043743777.
                </p>
              </div>

            </div>

            {/* CLICKABLE TEXT LINK PARAGRAPHS - DIRECT USER COMPLIANCE */}
            <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 space-y-4 max-w-4xl mx-auto text-center">
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                "Whether you choose to book our luxury <span onClick={() => openDestination('ooty')} className="text-brand-yellow font-bold underline cursor-pointer hover:text-brand-yellow-hover">Ooty Taxi</span> package for botanical walks, coordinate a serene <span onClick={() => openDestination('munnar')} className="text-brand-yellow font-bold underline cursor-pointer hover:text-brand-yellow-hover">Munnar Taxi</span> vacation among tea valleys, or take a quick royal heritage trip via our gorgeous <span onClick={() => openDestination('mysore')} className="text-brand-yellow font-bold underline cursor-pointer hover:text-brand-yellow-hover">Mysore Palace Taxi</span>, Get Taxi Kovai assures standard-class sanitized sedans and SUVs at prices that make sense."
              </p>
              <div className="text-[11px] text-gray-400 italic">
                (Click any of the underlined routes in the quotation sentence above to instantly load detailed itineraries and prices!)
              </div>
            </div>
          </div>
        </section>

        {/* FLEET INTRO */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="text-center space-y-2 mb-10">
            <h3 className="text-2xl font-black text-white font-sans tracking-tight">Our Immaculate Taxi Fleet</h3>
            <p className="text-xs text-gray-400">Pristine cars suited for all passenger groups and trip types</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VEHICLES.map((v) => (
              <div key={v.id} className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-4">
                    <LazyImage 
                      src={v.image} 
                      alt={v.name} 
                      className="transition-transform duration-500 hover:scale-105" 
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-slate-100 text-slate-800 font-black px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider">
                      {v.seats} Seats Available
                    </span>
                  </div>
                  <h4 className="font-extrabold text-base text-slate-950">{v.name}</h4>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    {v.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> AC Cabin, Airbags, Sound System & GPS Installed
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COIMBATORE TRAVEL BLOGS & GUIDES */}
        <section id="blog-section" className="max-w-6xl mx-auto px-4 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold text-brand-yellow uppercase tracking-widest bg-brand-yellow/10 border border-brand-yellow/20 px-3 py-1 rounded-full">
              Coimbatore Travel Blog
            </span>
            <h3 className="text-3xl font-black font-sans tracking-tight text-white">
              Expert Travel Guides & Hill Itineraries
            </h3>
            <p className="text-xs md:text-sm text-gray-400">
              Read tips and routes crafted by our tour specialists to make your outstation taxi trip from Coimbatore unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOGS.map((blog) => (
              <motion.div
                key={blog.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedBlog(blog)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-xs hover:border-gray-300 transition cursor-pointer flex flex-col md:flex-row h-full group"
              >
                <div className="md:w-2/5 h-48 md:h-full relative overflow-hidden shrink-0">
                  <LazyImage 
                    src={blog.image} 
                    alt={blog.title} 
                    className="group-hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 text-white text-[9px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs uppercase tracking-wide z-10">
                    {blog.category}
                  </span>
                </div>
                <div className="md:w-3/5 p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>
                    <h4 className="font-extrabold text-sm md:text-base text-slate-900 group-hover:text-brand-yellow-hover transition leading-tight text-left">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 text-left">
                      {blog.summary}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-1 text-[11px] font-bold text-brand-yellow-hover group-hover:translate-x-1 transition duration-150 justify-start">
                    Read Article <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* NEW SECTION: TRAVEL BLOGS & NEWS PLACEHOLDER */}
        <section id="blog-section" className="max-w-6xl mx-auto px-4 py-4 scroll-mt-24">
          <div className="bg-slate-950/40 border border-white/10 rounded-3xl p-8 md:p-12 text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-yellow/5 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="relative z-10 max-w-lg mx-auto space-y-3">
              <span className="text-[10px] font-black text-brand-yellow uppercase tracking-widest bg-brand-yellow/10 px-3 py-1 rounded-full">
                Latest Updates
              </span>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase font-display">
                Travel Blogs & News Hub
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-medium">
                Our latest news announcements, Coimbatore transit updates, and detailed Western Ghats route guidelines will appear here shortly. Stay tuned!
              </p>
              <div className="pt-2">
                <button 
                  onClick={scrollToCalculator} 
                  className="bg-brand-yellow hover:bg-brand-yellow-hover text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition duration-150 inline-flex items-center gap-1 cursor-pointer"
                >
                  Book Your Taxi Tour <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* COIMBATORE LOCAL GEO HUBS & GOOGLE REVIEWS (LOCAL SEO & TRUST AUTHORITY) */}
        <section id="local-coverage-section" className="max-w-6xl mx-auto px-4 scroll-mt-24">
          <LocalGeoHubs />
        </section>

        {/* ACCORDION FAQ SECTION */}
        <section className="max-w-4xl mx-auto px-4">
          <FAQ />
        </section>

        {/* INTERACTIVE GOOGLE MAP PREVIEW & REGIONAL HEADQUARTERS */}
        <section className="max-w-6xl mx-auto px-4 pb-4">
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Map Details Card */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="text-xs font-bold text-brand-yellow uppercase tracking-widest bg-brand-yellow/10 border border-brand-yellow/20 px-3 py-1 rounded-full">
                Regional Hub Office
              </span>
              <h3 className="text-2xl md:text-3xl font-black font-sans tracking-tight text-slate-950 leading-tight">
                Coimbatore Service Area & Dispatch Hub
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                Our main fleet terminal and driver dispatch center are centrally located near Coimbatore Junction & Airport routes. This enables our premium sedans, Ertiga, and Innova fleet to pick you up in under 20 minutes across Coimbatore city.
              </p>
              
              <div className="space-y-3 pt-2 text-xs md:text-sm text-slate-800 font-bold">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-yellow/10 flex items-center justify-center shrink-0 border border-brand-yellow/20">
                    <MapPin className="w-4 h-4 text-brand-yellow-hover" />
                  </div>
                  <span>Coimbatore International Airport, Gandhipuram, Coimbatore Railway Station, Singanallur, and Across Coimbatore City</span>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-yellow/10 flex items-center justify-center shrink-0 border border-brand-yellow/20">
                    <Phone className="w-4 h-4 text-brand-yellow-hover" />
                  </div>
                  <a href="tel:9043743777" className="hover:underline text-brand-yellow-hover font-black">
                    +91 90437 43777 (Dispatch & Bookings)
                  </a>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                  </div>
                  <a href="https://wa.me/919043743777" className="hover:underline text-emerald-700 font-extrabold">
                    Instant Booking Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Coimbatore,+Tamil+Nadu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-yellow hover:bg-brand-yellow-hover text-slate-950 font-black py-2.5 px-5 rounded-xl transition duration-150 text-xs shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                >
                  Open in Google Maps <Navigation className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Live Interactive Map IFrame Preview */}
            <div className="lg:col-span-7 h-80 md:h-96 rounded-2xl overflow-hidden border border-gray-150 shadow-inner relative group bg-gray-50">
              <iframe
                title="Get Taxi Kovai Coimbatore Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.5134688523!2d76.88483281144047!3d11.012014523910604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f976687%3A0x35070c0b90f2d19c!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition duration-500"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute top-3 left-3 bg-slate-950/90 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Coimbatore Coverage Live
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer id="footer-section" className="bg-slate-950 text-white mt-20 pt-16 pb-8 border-t border-slate-900 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-4 md:col-span-1 text-left">
            <h4 className="font-black text-lg tracking-tight text-white flex items-center gap-2">
              🚖 Get Taxi Kovai
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Coimbatore's premium outstation vacation specialist. We deliver absolute billing transparency, reliable air-conditioned cabs, and experienced hill drivers.
            </p>
            <div className="pt-2">
              <a 
                href="tel:9043743777" 
                className="bg-yellow-400 hover:bg-yellow-350 text-slate-950 font-extrabold px-4 py-2 rounded-full text-xs inline-flex items-center gap-1.5"
              >
                📞 Dial: 9043743777
              </a>
            </div>
          </div>

          <div className="space-y-3 text-left">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-yellow-400">Hill Vacation Packs</h4>
            <ul className="text-xs text-gray-400 space-y-2 font-medium">
              <li><button onClick={() => openDestination('ooty')} className="hover:text-white transition cursor-pointer text-left">🌲 Ooty Sightseeing Package</button></li>
              <li><button onClick={() => openDestination('munnar')} className="hover:text-white transition cursor-pointer text-left">🍃 Munnar Tea Valley Package</button></li>
              <li><button onClick={() => openDestination('kodaikanal')} className="hover:text-white transition cursor-pointer text-left">🏔️ Kodaikanal Princess Tour</button></li>
              <li><button onClick={() => openDestination('valparai')} className="hover:text-white transition cursor-pointer text-left">🐒 Valparai 40-Hairpin Package</button></li>
              <li><button onClick={() => openDestination('mysore')} className="hover:text-white transition cursor-pointer text-left">🏰 Mysore Palace Heritage Tour</button></li>
            </ul>
          </div>

          <div className="space-y-3 text-left">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-yellow-400">Temple Tours</h4>
            <ul className="text-xs text-gray-400 space-y-2 font-medium">
              <li><button onClick={() => openDestination('adiyogi')} className="hover:text-white transition cursor-pointer text-left">🙏 Adiyogi Shiva Statue Tour</button></li>
              <li><button onClick={() => openDestination('madurai')} className="hover:text-white transition cursor-pointer text-left">🛕 Madurai Meenakshi Temple Tour</button></li>
              <li><button onClick={scrollToCalculator} className="hover:text-white transition cursor-pointer text-left">🚗 Local Coimbatore City Rides</button></li>
              <li><button onClick={() => setShowAdmin(true)} className="text-yellow-400 font-bold hover:underline transition cursor-pointer text-left">📋 View Booking Inquiries</button></li>
            </ul>
          </div>

          <div className="space-y-3 text-left">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-yellow-400">Booking Helpdesk</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Office hours are open 24 hours, 7 days a week. For instantaneous manual dispatches, dial or WhatsApp directly:
            </p>
            <div className="space-y-1.5">
              <span className="text-sm font-bold block font-mono text-white">9043743777</span>
              <span className="text-[10px] text-gray-500 block">Registered Business: Coimbatore, TN</span>
            </div>
          </div>

        </div>

        {/* BOTTOM BRAND FOOTER */}
        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs text-gray-500">
          <div>
            <p>© 2026 Get Taxi Kovai. All rights reserved. Coimbatore Cab Division.</p>
            <p className="text-[10px] text-gray-600 mt-1">Replicated beautifully. All rates are inclusive of taxes and toll limits. Driver bhatta is standard.</p>
          </div>
          
          <div className="flex gap-4">
            <a href="tel:9043743777" className="hover:text-yellow-400 transition font-bold">Contact Us</a>
          </div>
        </div>
      </footer>

      {/* FLOATING CONTACT WIDGETS */}
      <div className="fixed bottom-24 md:bottom-6 left-6 z-40 flex flex-col gap-3">
        {/* WhatsApp Enquiry Desk */}
        <a
          href="https://wa.me/919043743777?text=Hello%20Get%20Taxi%20Kovai!%20I%20want%20to%20enquire%20about%20booking%20a%20taxi%20cab."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition border border-white/10 hover:scale-110 active:scale-95 animate-bounce-slow"
          title="WhatsApp enquiry desk"
        >
          <MessageSquare className="w-5 h-5 text-white fill-white" />
        </a>

        {/* Call Support Quick Widget */}
        <a
          href="tel:9043743777"
          className="bg-brand-yellow hover:bg-brand-yellow-hover text-slate-950 p-3.5 rounded-full shadow-2xl flex items-center justify-center transition border border-white/20 hover:scale-110 active:scale-95"
          title="Call booking desk"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      {/* MODALS AND DRAWERS RENDERING */}
      <AnimatePresence>
        {selectedDest && (
          <DestinationModal 
            destination={selectedDest} 
            onClose={() => setSelectedDest(null)} 
          />
        )}
        
        {showAdmin && (
          <InquiryList 
            onClose={() => setShowAdmin(false)} 
          />
        )}

        {/* BLOG POST READER MODAL */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="space-y-1 text-left">
                  <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wide">
                    <span>Home</span>
                    <span>&gt;</span>
                    <span>Blog</span>
                    <span>&gt;</span>
                    <span className="text-indigo-600 truncate max-w-[200px]">{selectedBlog.title}</span>
                  </div>
                  <h4 className="font-extrabold text-sm md:text-base text-slate-900 leading-tight">
                    {selectedBlog.title}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-slate-950 p-2 rounded-xl transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                 {/* Banner image */}
                <div className="h-56 w-full rounded-2xl overflow-hidden relative">
                  <LazyImage 
                    src={selectedBlog.image} 
                    alt={selectedBlog.title} 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                  <span className="absolute bottom-4 left-4 bg-yellow-400 text-slate-950 font-extrabold text-[10px] px-3 py-1 rounded-lg uppercase tracking-wide shadow-xs z-10">
                    {selectedBlog.category}
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-gray-400 font-bold border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{selectedBlog.date}</span>
                  </div>
                  <span>•</span>
                  <span>{selectedBlog.readTime}</span>
                  <span>•</span>
                  <span className="text-indigo-600">Verified Travel Guide</span>
                </div>

                {/* Content paragraphs */}
                <div className="space-y-4 text-slate-700 text-sm leading-relaxed font-normal">
                  {selectedBlog.content.map((p, idx) => (
                    <p key={idx} className="first-letter:text-2xl first-letter:font-extrabold first-letter:text-indigo-600 first-letter:mr-1">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Inline contextual destination recommendation */}
                <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl space-y-3 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚖</span>
                    <h5 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                      Explore this destination yourself!
                    </h5>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Ready to feel the cool breeze and beautiful hills yourself? Check our premium, clean-cab packages with professional hill chauffeurs starting right from Coimbatore.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedBlog(null);
                        scrollToCalculator();
                      }}
                      className="bg-slate-950 hover:bg-slate-850 text-white text-xs font-bold py-2 px-4 rounded-xl transition cursor-pointer"
                    >
                      Estimate Fare & Book Now
                    </button>
                    <a
                      href="tel:9043743777"
                      className="bg-white hover:bg-slate-50 text-slate-900 border border-gray-200 text-xs font-bold py-2 px-4 rounded-xl transition inline-flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-900" /> Support: 9043743777
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SERVER-SIDE POWERED AI TRAVEL ASSISTANT CHAT */}
      <AIAssistant />

      {/* STICKY MOBILE BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-45 bg-white border-t border-gray-150 py-2.5 px-4 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] flex justify-around items-center md:hidden backdrop-blur-md bg-white/90">
        <button 
          onClick={scrollToTop} 
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-indigo-600 transition cursor-pointer bg-transparent border-0 focus:outline-hidden"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">Home</span>
        </button>

        <button 
          onClick={scrollToPackages} 
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-indigo-600 transition cursor-pointer bg-transparent border-0 focus:outline-hidden"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">Vacations</span>
        </button>

        <button 
          onClick={scrollToCalculator} 
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-yellow-600 transition cursor-pointer bg-transparent border-0 focus:outline-hidden"
        >
          <Car className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">Book Cab</span>
        </button>

        <button 
          onClick={scrollToFAQ} 
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-indigo-600 transition cursor-pointer bg-transparent border-0 focus:outline-hidden"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">FAQ Help</span>
        </button>

        <button 
          onClick={triggerAIChat} 
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-indigo-600 transition cursor-pointer relative bg-transparent border-0 focus:outline-hidden"
        >
          <MessageSquare className="w-5 h-5 text-yellow-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-tight">Kovai AI</span>
          <span className="absolute top-0 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </div>
  );
}
