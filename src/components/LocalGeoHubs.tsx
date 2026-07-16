import { useState, useEffect } from 'react';
import { MapPin, Plane, Train, Star, ShieldCheck, Clock, CheckCircle2, ChevronRight, MessageSquare, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface ZoneInfo {
  name: string;
  landmark: string;
  avgTime: string;
  type: 'neighborhood' | 'transit';
  desc: string;
  popularRoute: string;
}

export default function LocalGeoHubs() {
  const [activeTab, setActiveTab] = useState<'all' | 'transit' | 'neighborhood'>('all');
  
  // Dynamic JSON-LD Structured Schema Injection
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "name": "Get Taxi Kovai",
      "description": "Premium outstation taxi & cab service in Coimbatore. Safe, certified drivers with 5+ years mountain ghat road experience for Ooty, Munnar, Valparai, Kodaikanal & Mysore.",
      "telephone": "+919043743777",
      "url": window.location.origin,
      "logo": window.location.origin + "/logo.png",
      "priceRange": "₹₹",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Get Taxi Kovai",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Gandhipuram Central Bus Stand Road",
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
        { "@type": "Place", "name": "Coimbatore, Tamil Nadu, India" },
        { "@type": "Place", "name": "Ooty, Tamil Nadu, India" },
        { "@type": "Place", "name": "Munnar, Kerala, India" },
        { "@type": "Place", "name": "Kodaikanal, Tamil Nadu, India" },
        { "@type": "Place", "name": "Valparai, Tamil Nadu, India" },
        { "@type": "Place", "name": "Mysore, Karnataka, India" },
        { "@type": "Place", "name": "Adiyogi Isha Center, Coimbatore" }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "482",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'get-taxi-kovai-jsonld';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('get-taxi-kovai-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const localZones: ZoneInfo[] = [
    {
      name: "Coimbatore International Airport",
      landmark: "Peelamedu, Avinashi Road",
      avgTime: "Instant / Meet & Greet",
      type: "transit",
      desc: "Perfect for incoming passengers landing in Coimbatore. Our drivers wait with name placards in the arrival zone for smooth transfers.",
      popularRoute: "Airport to Ooty / Munnar"
    },
    {
      name: "Gandhipuram",
      landmark: "GP Hospital / Cross Cut Road",
      avgTime: "Within 5 mins",
      type: "neighborhood",
      desc: "Coimbatore's main transit node. Ideal for travelers staying in local business hotels requiring outstation day trips.",
      popularRoute: "Gandhipuram to Isha Adiyogi"
    },
    {
      name: "Coimbatore Railway Station",
      landmark: "State Bank Road / Town Hall",
      avgTime: "Within 5-10 mins",
      type: "transit",
      desc: "Seamless pickup right at the main exit or back gate. Safely loading luggage into spacious AC sedans or SUVs.",
      popularRoute: "Station to Valparai / Kodaikanal"
    },
    {
      name: "Singanallur",
      landmark: "Trichy Road Bus Stand",
      avgTime: "Within 10 mins",
      type: "neighborhood",
      desc: "Serving southern gateways and industrial hubs with swift vehicle dispatches.",
      popularRoute: "Singanallur to Kodaikanal Drop"
    },
    {
      name: "Across Coimbatore City",
      landmark: "All Municipal Zones",
      avgTime: "Within 15 mins",
      type: "neighborhood",
      desc: "Comprehensive door-to-door cab dispatches across all residential and business sectors of Coimbatore.",
      popularRoute: "Local Coverage Guaranteed"
    }
  ];

  const filteredZones = localZones.filter(zone => {
    if (activeTab === 'all') return true;
    return zone.type === activeTab;
  });

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden border border-slate-800">
      {/* Background glow lines */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-yellow-400/20">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Local Search & Geographic Optimization
          </div>
          <h3 className="text-2xl md:text-3xl font-black font-sans tracking-tight">
            Coimbatore Pickup Hubs & Local Coverage
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
            We provide verified, GPS-tracked taxi pickups across all major neighborhoods and transit terminals in Coimbatore with zero surge pricing. Select a zone to view details.
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex bg-slate-950 p-1 rounded-xl self-start lg:self-center border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'all' ? 'bg-yellow-400 text-slate-950' : 'text-gray-400 hover:text-white'
            }`}
          >
            All Zones
          </button>
          <button
            onClick={() => setActiveTab('transit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'transit' ? 'bg-yellow-400 text-slate-950' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plane className="w-3 h-3" /> Transit Terminals
          </button>
          <button
            onClick={() => setActiveTab('neighborhood')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'neighborhood' ? 'bg-yellow-400 text-slate-950' : 'text-gray-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3 h-3" /> Neighborhoods
          </button>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredZones.map((zone, idx) => (
          <div 
            key={idx}
            className="bg-slate-950/55 border border-slate-800/80 rounded-2xl p-4 md:p-5 flex flex-col justify-between hover:border-slate-700 transition duration-150 text-left space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-xs font-black text-white leading-tight">
                  {zone.type === 'transit' ? (
                    <span className="p-1 bg-indigo-500/15 rounded-md text-indigo-400 shrink-0">
                      {zone.name.includes('Airport') ? <Plane className="w-3.5 h-3.5" /> : <Train className="w-3.5 h-3.5" />}
                    </span>
                  ) : (
                    <span className="p-1 bg-yellow-500/15 rounded-md text-yellow-400 shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {zone.name}
                </span>
                <span className="text-[9px] bg-slate-900 text-gray-400 font-extrabold px-2 py-0.5 rounded-md border border-slate-800 shrink-0">
                  {zone.type === 'transit' ? 'Transit' : 'Hub'}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                <span>📍 Key Node:</span>
                <span className="text-gray-300">{zone.landmark}</span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                {zone.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] text-gray-500 font-bold">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-yellow-400" /> Wait: <span className="text-white">{zone.avgTime}</span>
              </div>
              <div className="text-indigo-400 flex items-center gap-0.5 uppercase tracking-wide text-[9px]">
                {zone.popularRoute}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Google Business Citation & Review Section */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Google Business Profile</span>
          </div>
          <h4 className="text-xl font-black font-sans tracking-tight text-white">
            Verified Customer Feedback
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
            We value genuine experiences. To maintain complete transparency and build trust, all of our customer feedback is verified and published directly on Google.
          </p>
        </div>
        <div>
          <a
            href="https://search.google.com/local/reviews?placeid=ChIJ_placeholder_get_taxi_kovai"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-yellow hover:bg-brand-yellow-hover text-slate-950 font-black py-3.5 px-6 rounded-xl transition duration-150 text-xs shadow-lg inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Compass className="w-4 h-4 text-slate-950" /> View our Verified Google Reviews
          </a>
        </div>
      </div>
    </div>
  );
}
