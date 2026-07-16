import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, Calendar, MapPin, Navigation, Info, Clock, 
  CheckCircle, ChevronRight, Phone, MessageSquare, AlertCircle, X, Sparkles 
} from 'lucide-react';
import { TripType, VehicleOption, Inquiry } from '../types';
import { VEHICLES, calculateTaxiFare, DESTINATIONS } from '../data';

interface BookingFormProps {
  initialDestinationId?: string;
  onSuccess?: (inquiry: Inquiry) => void;
}

// Read Google Maps API key from environment configuration and trim whitespace to prevent invalid key errors
const API_KEY = (process.env.GOOGLE_MAPS_PLATFORM_KEY || '').trim();

export default function BookingForm({ initialDestinationId, onSuccess }: BookingFormProps) {
  // Input Refs for Google Autocomplete
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropInputRef = useRef<HTMLInputElement>(null);

  // Trip details state
  const [tripType, setTripType] = useState<TripType>('local');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [distanceKm, setDistanceKm] = useState<number>(40); 
  const [days, setDays] = useState<number>(1);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(VEHICLES[0]); // Default to Sedan

  // Google Maps integration states
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [calculationError, setCalculationError] = useState('');
  const [mapsError, setMapsError] = useState('');

  // Contact details state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // New Date-time states
  const [pickupDateTime, setPickupDateTime] = useState('2026-07-15T09:00');
  const [returnDateTime, setReturnDateTime] = useState('2026-07-16T18:00');
  const [hourlyHours, setHourlyHours] = useState<number>(4);

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [createdInquiry, setCreatedInquiry] = useState<Inquiry | null>(null);
  const [error, setError] = useState('');

  // 1. Load Google Maps Platform JavaScript API dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Capture authentication/key failures gracefully
    (window as any).gm_authFailure = () => {
      const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
      setMapsError(`Google Maps API key authorization failed (RefererNotAllowedMapError). Google requires you to authorize this specific URL in your Google Cloud Console Key Restrictions:

👉 ${currentUrl}/*

To resolve this:
1. Go to your Google Cloud Console (APIs & Services > Credentials).
2. Click on your Google Maps API Key.
3. Under "Website restrictions", add the authorized website URL pattern above.
4. Click Save, and allow up to 5 minutes for Google's servers to update.`);
    };

    if ((window as any).google?.maps?.places) {
      setIsMapsLoaded(true);
      return;
    }
    
    const scriptId = 'google-maps-js-sdk';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsMapsLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = API_KEY 
      ? `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`
      : `https://maps.googleapis.com/maps/api/js?libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsMapsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 2. Initialize Google Autocomplete on input fields (Run EXACTLY ONCE upon load to prevent double-binding and listener conflicts)
  useEffect(() => {
    if (!isMapsLoaded || !(window as any).google) return;

    let pickupAutocomplete: any = null;
    let dropAutocomplete: any = null;

    if (pickupInputRef.current) {
      pickupAutocomplete = new (window as any).google.maps.places.Autocomplete(pickupInputRef.current, {
        componentRestrictions: { country: 'in' },
        fields: ['formatted_address', 'geometry', 'name']
      });

      pickupAutocomplete.addListener('place_changed', () => {
        const place = pickupAutocomplete?.getPlace();
        const address = place?.formatted_address || place?.name;
        if (address) {
          setPickup(address);
        }
      });
    }

    if (dropInputRef.current) {
      dropAutocomplete = new (window as any).google.maps.places.Autocomplete(dropInputRef.current, {
        componentRestrictions: { country: 'in' },
        fields: ['formatted_address', 'geometry', 'name']
      });

      dropAutocomplete.addListener('place_changed', () => {
        const place = dropAutocomplete?.getPlace();
        const address = place?.formatted_address || place?.name;
        if (address) {
          setDrop(address);
        }
      });
    }

    return () => {
      if ((window as any).google?.maps?.event) {
        if (pickupAutocomplete) (window as any).google.maps.event.clearInstanceListeners(pickupAutocomplete);
        if (dropAutocomplete) (window as any).google.maps.event.clearInstanceListeners(dropAutocomplete);
      }
    };
  }, [isMapsLoaded]);

  // 3. Dynamic Google Maps Distance Matrix API calculation
  useEffect(() => {
    if (!isMapsLoaded || !(window as any).google || !pickup.trim()) return;

    // For hourly trips, we use predefined hourly values based on duration
    if (tripType === 'hourly') {
      setDistanceKm(hourlyHours * 10);
      return;
    }

    // For local trips, if no specific destination is selected, fall back to standard package (40 km)
    if (tripType === 'local' && (!drop.trim() || drop === 'Coimbatore Local Only' || drop === 'Coimbatore Local')) {
      setDistanceKm(40);
      return;
    }

    // Ensure we have a valid destination selected for outstation
    if (!drop.trim() || drop === 'Coimbatore Local Only' || drop === 'Coimbatore Local') {
      return;
    }

    setIsCalculatingDistance(true);
    setCalculationError('');

    try {
      const service = new (window as any).google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [pickup],
          destinations: [drop],
          travelMode: (window as any).google.maps.TravelMode.DRIVING,
          unitSystem: (window as any).google.maps.UnitSystem.METRIC,
        },
        (response: any, status: any) => {
          setIsCalculatingDistance(false);
          if (status === 'OK' && response && response.rows[0]?.elements[0]) {
            const element = response.rows[0].elements[0];
            if (element.status === 'OK' && element.distance) {
              const distanceInMeters = element.distance.value;
              let distanceInKm = Math.ceil(distanceInMeters / 1000);
              
              // For outstation round trips, double the distance to account for back-and-forth travel
              if (tripType === 'round_trip') {
                distanceInKm = distanceInKm * 2;
              }
              
              // Respect minimum outstation guarantees
              if (tripType === 'local') {
                setDistanceKm(distanceInKm);
              } else {
                const minAllowed = tripType === 'one_way' ? 130 : (days * 250);
                setDistanceKm(Math.max(minAllowed, distanceInKm));
              }
            } else {
              setCalculationError('Google Maps driving route unavailable. Using estimated distance.');
              // Fallback matching logic
              const matchingDest = DESTINATIONS.find(d => 
                drop.toLowerCase().includes(d.id.toLowerCase()) || 
                drop.toLowerCase().includes(d.title.toLowerCase())
              );
              if (matchingDest) {
                setDistanceKm(tripType === 'round_trip' ? matchingDest.distanceKm : Math.round(matchingDest.distanceKm / 2));
              }
            }
          } else {
            setCalculationError('Unable to connect to Google Maps API. Using estimated fallback.');
          }
        }
      );
    } catch (err) {
      setIsCalculatingDistance(false);
      setCalculationError('Google Maps Distance Matrix service is temporarily unavailable. Using estimated fallback.');
    }
  }, [pickup, drop, tripType, days, isMapsLoaded]);

  // Auto-fill details if an initial destination is selected
  useEffect(() => {
    if (initialDestinationId) {
      const dest = DESTINATIONS.find(d => d.id === initialDestinationId);
      if (dest) {
        setTripType('round_trip');
        setPickup('Coimbatore');
        setDrop(dest.title);
        setDistanceKm(dest.distanceKm);
        setDays(dest.id === 'adiyogi' ? 1 : 2); // Adiyogi is usually 1 day, hills 2+ days
      }
    }
  }, [initialDestinationId]);

  // Adjust defaults when trip type changes
  const handleTripTypeChange = (type: TripType) => {
    setTripType(type);
    if (type === 'hourly') {
      setDistanceKm(hourlyHours * 10);
      setDays(hourlyHours);
      setDrop('');
    } else if (type === 'local') {
      setDistanceKm(40);
      setDays(1);
      setDrop('');
    } else if (type === 'one_way') {
      setDistanceKm(130);
      setDays(1);
      setDrop('');
    } else {
      setDistanceKm(500); // 2 days * 250 = 500
      setDays(2);
      setDrop('');
    }
  };

  // Calculate days for round trip dynamically
  useEffect(() => {
    if (tripType === 'round_trip' && pickupDateTime && returnDateTime) {
      const start = new Date(pickupDateTime);
      const end = new Date(returnDateTime);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const finalDays = Math.max(1, diffDays);
        setDays(finalDays);
        // Maintain minimum coverage for round trip: days * 250
        setDistanceKm(prev => Math.max(finalDays * 250, prev));
      }
    }
  }, [pickupDateTime, returnDateTime, tripType]);

  // Adjust hours for hourly rental dynamically
  useEffect(() => {
    if (tripType === 'hourly') {
      setDays(hourlyHours);
      setDistanceKm(hourlyHours * 10);
    }
  }, [hourlyHours, tripType]);

  // Define initial load condition where distance/fare should show as exactly 0
  const isInitialLoad = !pickup.trim() || (tripType !== 'local' && tripType !== 'hourly' && !drop.trim());

  // Perform the live fare calculation
  const { fare, inclusions, overageRate, tripPackage, vehicleSelected, breakdown, isEnquiryOnly } = calculateTaxiFare(
    selectedVehicle.type,
    tripType,
    (tripType === 'hourly' || tripType === 'local') ? (drop.trim() || 'Coimbatore Local') : drop,
    days,
    isInitialLoad ? 0 : distanceKm
  );

  const travelDate = tripType === 'round_trip'
    ? `Start: ${pickupDateTime.replace('T', ' ')} | Return: ${returnDateTime.replace('T', ' ')}`
    : `Pickup: ${pickupDateTime.replace('T', ' ')}` + (tripType === 'hourly' ? ` (${hourlyHours} hrs rental)` : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!pickup.trim()) {
      setError('Please enter your pickup location');
      return;
    }
    if (!drop.trim() && tripType !== 'hourly' && tripType !== 'local') {
      setError('Please enter your destination');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const finalDrop = (tripType === 'local' || tripType === 'hourly') ? (drop.trim() || 'Coimbatore Local') : drop;

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          tripType,
          pickupLocation: pickup,
          dropLocation: finalDrop,
          distanceKm,
          daysNeeded: days,
          vehicleType: selectedVehicle.name,
          travelDate,
          estimatedFare: fare,
          specialRequests: notes
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitSuccess(true);
        setCreatedInquiry(data.inquiry);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 8000);
        if (onSuccess) {
          onSuccess(data.inquiry);
        }
      } else {
        setError(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try calling us directly at 9043743777.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setNotes('');
    setSubmitSuccess(false);
    setShowToast(false);
    setCreatedInquiry(null);
  };

  const triggerCall = () => {
    window.location.href = 'tel:9043743777';
  };

  const triggerWhatsApp = () => {
    const messageText = `Hello Get Taxi Kovai! I want to book a ${selectedVehicle.name} for a ${tripType === 'local' ? 'Local Trip' : tripType === 'one_way' ? 'One Way outstation' : 'Round Trip outstation'} from ${pickup || 'Coimbatore'} to ${drop || 'Destination'} on ${travelDate || 'Date'}. Is it available?`;
    window.open(`https://wa.me/919043743777?text=${encodeURIComponent(messageText)}`, '_blank');
  };

  return (
    <div id="booking-form-container" className="bg-white rounded-[2rem] shadow-2xl shadow-black/50 overflow-hidden border border-gray-100 text-slate-800">
      {/* Form Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-5 text-white flex justify-between items-center">
        <div>
          <h3 className="text-xl font-extrabold font-sans tracking-tight">Instant Fare Calculator</h3>
          <p className="text-xs text-gray-400 mt-1">Get your direct, transparent taxi quote instantly</p>
        </div>
        <div className="bg-brand-yellow text-slate-950 font-black px-3 py-1.5 rounded-full text-xs flex items-center gap-1 shadow-sm">
          <Car className="w-3.5 h-3.5" /> No Hidden Fees
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {!submitSuccess ? (
            <motion.form 
              key="booking-inputs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Trip Type Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-full border border-gray-200">
                {(['local', 'hourly', 'one_way', 'round_trip'] as TripType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTripTypeChange(type)}
                    className={`py-2 text-[11px] md:text-xs font-bold rounded-full capitalize transition-all cursor-pointer ${
                      tripType === type 
                        ? 'bg-slate-300 text-slate-950 shadow-inner font-extrabold' 
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/50'
                    }`}
                  >
                    {type === 'local' ? 'Local Ride' : type === 'hourly' ? 'Hourly Rental' : type === 'one_way' ? 'One-Way Drop' : 'Round Trip'}
                  </button>
                ))}
              </div>

              {mapsError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded-2xl flex items-start gap-2.5 shadow-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block mb-0.5">Google Maps Key Authorization Error</span>
                    <p className="text-amber-700 leading-relaxed whitespace-pre-line">{mapsError}</p>
                  </div>
                </div>
              )}

              {/* Journey Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="seo-journey-details">
                <div>
                  <label htmlFor="pickup_location" className="block text-xs font-semibold text-gray-600 uppercase mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-yellow" /> Pickup Location
                  </label>
                  <input
                    id="pickup_location"
                    name="pickup_location"
                    type="text"
                    required
                    ref={pickupInputRef}
                    placeholder="e.g. Coimbatore Airport, RS Puram"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-sm text-gray-800"
                  />
                </div>

                <div>
                  <label htmlFor="drop_location" className="block text-xs font-semibold text-gray-600 uppercase mb-1.5 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-brand-yellow" /> Drop Destination
                  </label>
                  <input
                    id="drop_location"
                    name="drop_location"
                    type="text"
                    required={tripType !== 'local' && tripType !== 'hourly'}
                    ref={dropInputRef}
                    placeholder={tripType === 'hourly' || tripType === 'local' ? "e.g. Coimbatore Airport, RS Puram (Optional)" : "e.g. Ooty, Munnar, RS Puram"}
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-sm text-gray-800 font-medium"
                  />
                </div>
              </div>

              {/* Date, Time & Hours Controls - Dynamic based on Trip Type */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                {tripType === 'round_trip' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pickup_datetime" className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> Start Date & Time
                      </label>
                      <input
                        id="pickup_datetime"
                        type="datetime-local"
                        required
                        value={pickupDateTime}
                        onChange={(e) => setPickupDateTime(e.target.value)}
                        className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-sm text-gray-800"
                      />
                    </div>
                    <div>
                      <label htmlFor="return_datetime" className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> Return Date & Time
                      </label>
                      <input
                        id="return_datetime"
                        type="datetime-local"
                        required
                        value={returnDateTime}
                        onChange={(e) => setReturnDateTime(e.target.value)}
                        className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-sm text-gray-800"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pickup_datetime_single" className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> Pickup Date & Time
                      </label>
                      <input
                        id="pickup_datetime_single"
                        type="datetime-local"
                        required
                        value={pickupDateTime}
                        onChange={(e) => setPickupDateTime(e.target.value)}
                        className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-sm text-gray-800"
                      />
                    </div>

                    {tripType === 'hourly' && (
                      <div>
                        <label htmlFor="rental_hours" className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-yellow" /> Rental Duration (1-12 Hours)
                        </label>
                        <select
                          id="rental_hours"
                          value={hourlyHours}
                          onChange={(e) => setHourlyHours(Number(e.target.value))}
                          className="w-full px-4 py-2 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-sm text-gray-800"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hr) => (
                            <option key={hr} value={hr}>
                              {hr} {hr === 1 ? 'Hour' : 'Hours'}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* Dynamic Calculated Distance Display */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-brand-yellow shrink-0" />
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Total Distance</span>
                        <span className="text-xs text-slate-700 font-bold">
                          {tripType === 'local' && (!drop.trim() || drop === 'Coimbatore Local' || drop === 'Coimbatore Local Only') ? 'Local Coimbatore (Default Package)' : tripType === 'hourly' ? 'Hourly Local Rental' : 'Calculated via Google Maps'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {isCalculatingDistance ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs font-bold text-slate-500">Calculating...</span>
                        </div>
                      ) : (
                        <span className="text-base font-extrabold text-slate-900">
                          {isInitialLoad ? 0 : distanceKm} KM
                        </span>
                      )}
                    </div>
                  </div>
                  {calculationError && (
                    <p className="text-[10px] text-amber-600 font-bold mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {calculationError}
                    </p>
                  )}
                  {tripType === 'hourly' && (
                    <p className="text-[11px] text-amber-700 mt-1.5 flex items-center gap-1 font-bold">
                      <Info className="w-3.5 h-3.5 shrink-0" /> Includes 10 km free per hour. Overage is calculated instantly.
                    </p>
                  )}
                </div>
              </div>

              {/* Vehicle Options Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-3 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-brand-yellow" /> Select Your Fleet Vehicle
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {VEHICLES.map((v) => {
                    const isSelected = selectedVehicle.id === v.id;
                    const fareResult = calculateTaxiFare(v.type, tripType, drop, days, isInitialLoad ? 0 : distanceKm);
                    const isEnq = fareResult.isEnquiryOnly;
                    const individualFare = fareResult.fare;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVehicle(v)}
                        className={`text-left p-3.5 rounded-xl border transition-all relative cursor-pointer flex flex-col justify-between ${
                          isSelected 
                            ? 'border-brand-yellow bg-brand-yellow/5 ring-2 ring-brand-yellow/10 shadow-sm' 
                            : 'border-gray-200 hover:border-brand-yellow/30 hover:bg-brand-yellow/5'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            {/* BLOCK REPLACEMENTS FOR ALL VEHICLE IMAGES */}
                            <div className="w-16 h-10 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 flex flex-col items-center justify-center p-0.5 text-center leading-none">
                              <span className="text-lg">🚖</span>
                              <span className="text-[7px] font-bold text-brand-yellow mt-0.5 uppercase tracking-wide">
                                {v.id === 'premium_suv' || v.type === 'Premium_SUV' ? 'Premium' : v.id === 'suv_prime' || v.type === 'SUV_Prime' ? 'Prime' : 'Sedan'}
                              </span>
                            </div>
                            <span className="text-[9px] uppercase tracking-wider bg-brand-yellow/20 font-extrabold px-1.5 py-0.5 rounded text-slate-800">
                              {v.seats} Seats
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-gray-800">{v.name}</h4>
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed line-clamp-2">
                            {v.description}
                          </p>
                        </div>
                        
                        <div className="mt-3 pt-2 border-t border-gray-100 flex items-end justify-between w-full">
                          <span className="text-[9px] text-gray-400 font-semibold">Est. Fare</span>
                          <span className="text-xs font-black text-slate-800">
                            {isEnq ? (
                              'On Enquiry Only'
                            ) : tripType === 'local' ? (
                              `₹${Math.floor((individualFare * 0.975) / 10) * 10} - ₹${Math.ceil((individualFare * 1.025) / 10) * 10}`
                            ) : (
                              `₹${individualFare.toLocaleString('en-IN')}`
                            )}
                          </span>
                        </div>
                        
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <span className="w-2 h-2 bg-brand-yellow rounded-full border border-white inline-block shadow-sm animate-pulse"></span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DYNAMIC ESTIMATED FARE BOX WITH BRAND AMBER THEME */}
              <div className="bg-brand-card text-white p-6 rounded-2xl border border-white/10 relative overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 bg-brand-yellow text-slate-950 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Live Estimate
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-yellow">
                    <CheckCircle className="w-4 h-4 text-brand-yellow" /> Fare Calculated Real-Time
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-white/5">
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[9px] block">Vehicle Selected</span>
                      <span className="text-white font-extrabold text-sm">{vehicleSelected}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[9px] block">Trip Package</span>
                      <span className="text-white font-extrabold text-sm capitalize">{tripPackage}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-white/5">
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[9px] block">Inclusions</span>
                      <span className="text-gray-300 font-medium leading-relaxed block">{inclusions}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[9px] block">Overage Rate</span>
                      <span className="text-brand-yellow font-extrabold block">{overageRate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Total Estimated Fare</span>
                    {isEnquiryOnly ? (
                      <span className="text-2xl font-black text-white flex items-center">
                        Enquiry Only
                      </span>
                    ) : tripType === 'local' ? (
                      <span className="text-3xl font-black text-white font-mono flex items-center">
                        ₹{Math.floor((fare * 0.975) / 10) * 10} - ₹{Math.ceil((fare * 1.025) / 10) * 10}
                      </span>
                    ) : (
                      <span className="text-3xl font-black text-white font-mono flex items-center">
                        ₹{fare.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-[10px] text-brand-yellow block font-bold mt-0.5">
                      {isEnquiryOnly ? '✔ Direct Call or WhatsApp Booking Only' : '✔ No Hidden Charges • Driver Beta Included'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={triggerCall}
                      className="flex-1 sm:flex-initial bg-slate-950 hover:bg-slate-900 text-white font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-yellow" /> Call Helpline
                    </button>
                    <button
                      type="button"
                      onClick={triggerWhatsApp}
                      className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center shrink-0"
                      title="Book on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4 text-white fill-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Inquiry details form */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  Complete Inquiry to Hold this Ride
                </h4>

                {error && (
                  <div className="bg-brand-yellow/5 text-brand-yellow p-3 rounded-xl text-xs flex items-center gap-2 border border-brand-yellow/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="full_name" className="block text-xs font-semibold text-gray-600 mb-1">
                      Your Full Name
                    </label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                      placeholder="e.g. Anand Swamy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-sm text-gray-800"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone_number" className="block text-xs font-semibold text-gray-600 mb-1">
                      Mobile Number
                    </label>
                    <input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      required
                      placeholder="e.g. 9043743777"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-sm text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="special_notes" className="block text-xs font-semibold text-gray-600 mb-1">
                      Special Notes (Optional)
                    </label>
                    <input
                      id="special_notes"
                      name="special_notes"
                      type="text"
                      placeholder="e.g. child seat, luggage details"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-sm text-gray-800"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="flex gap-2 w-full">
                      {isEnquiryOnly ? (
                        <button
                          type="button"
                          onClick={triggerCall}
                          className="flex-1 bg-slate-950 hover:bg-slate-900 text-white font-black py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg text-xs"
                        >
                          <Phone className="w-4 h-4 text-brand-yellow" /> Call Booking Desk
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-slate-950 hover:bg-slate-900 text-white font-black py-3.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 text-xs"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              Calculate Fare & Call Back <ChevronRight className="w-4 h-4 text-brand-yellow" />
                            </>
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={triggerWhatsApp}
                        className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-xl transition flex items-center justify-center cursor-pointer shadow-lg shrink-0"
                        title="Enquire on WhatsApp"
                      >
                        <MessageSquare className="w-5 h-5 text-white fill-white" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-center text-gray-400 mt-2">
                  🔒 Your details are secure. We will contact you immediately at 9043743777 to confirm dispatch.
                </p>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="booking-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-10 px-6 text-center space-y-8"
            >
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 ring-8 ring-emerald-50">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-slate-950 p-1.5 rounded-full shadow animate-bounce">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-3">
                <span className="text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-100/70 px-3 py-1 rounded-full uppercase">
                  Reservation Pending Confirmation
                </span>
                <h3 className="text-3xl font-black text-slate-950 font-sans tracking-tight">
                  Inquiry Registered!
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Thank you, <span className="font-extrabold text-slate-900">{name}</span>. Your ride reservation has been logged in our system. Your unique request reference is:
                </p>
                <div className="bg-slate-900 text-amber-400 font-mono text-sm px-5 py-2.5 rounded-xl inline-block font-black shadow-inner border border-slate-800">
                  {createdInquiry?.id || 'KOV_INQ_987'}
                </div>
              </div>

              {/* Digital Taxi Ticket Receipt */}
              <div className="bg-slate-50 border-2 border-dashed border-gray-250 p-6 rounded-2xl text-left text-xs text-gray-600 space-y-3 max-w-md mx-auto relative overflow-hidden shadow-sm">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r border-gray-250"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l border-gray-250"></div>
                
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[10px] border-b border-gray-250 pb-2 mb-2 text-center">
                  Estimated Trip Invoice
                </h4>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-500">Fleet Class:</span>
                  <span className="font-black text-slate-900">{selectedVehicle.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-500">Service Type:</span>
                  <span className="font-black text-indigo-600 capitalize">
                    {tripType === 'local' ? 'Local City' : tripType === 'hourly' ? 'Hourly Rental' : tripType === 'one_way' ? 'One-Way Drop' : 'Outstation Tour'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-500">Route:</span>
                  <span className="font-black text-slate-900 capitalize">
                    {pickup || 'Coimbatore'} ➔ {tripType === 'hourly' ? 'Coimbatore Local' : (drop || 'Destination')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-500">Travel Date:</span>
                  <span className="font-black text-slate-900">{travelDate}</span>
                </div>
                {tripType === 'hourly' && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-500">Duration Limit:</span>
                    <span className="font-black text-slate-900">{days} Hours</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-dashed border-gray-250 pt-3 font-black text-sm text-slate-950">
                  <span>Estimated Net Fare:</span>
                  <span className="text-slate-950 text-base font-black font-mono">
                    ₹{fare.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* HIGH CONTRAST EMERGENCY HOTLINES CARD */}
              <div className="bg-brand-yellow/10 border-2 border-brand-yellow/30 p-5 rounded-2xl max-w-md mx-auto space-y-4 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest block">
                    ⚡ NEED INSTANT CONFIRMATION?
                  </span>
                  <h4 className="text-xs text-slate-700 font-bold">
                    We will call you right back, or you can call us directly:
                  </h4>
                  <a 
                    href="tel:9043743777" 
                    className="block text-2xl font-black text-slate-950 font-mono tracking-tight hover:text-brand-yellow-hover transition"
                  >
                    +91 90437 43777
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <button
                    onClick={triggerWhatsApp}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20 text-xs"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp Now
                  </button>
                  <button
                    onClick={triggerCall}
                    className="bg-brand-yellow hover:bg-brand-yellow-hover text-slate-950 font-black py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-yellow/20 text-xs"
                  >
                    <Phone className="w-4 h-4" /> Call Helpline
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-500 hover:text-slate-900 font-bold hover:underline py-2.5 px-6 rounded-lg transition-all border border-gray-250 hover:bg-gray-50 cursor-pointer"
                >
                  Calculate & Book Another Ride
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FLOATING TOAST NOTIFICATION ON THE SCREEN */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-950 text-white p-4 rounded-2xl shadow-2xl border border-brand-yellow/30 flex items-start gap-3.5 text-left"
          >
            <div className="bg-emerald-500 text-slate-950 p-2 rounded-xl shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0 pr-4">
              <span className="text-[10px] font-black text-brand-yellow uppercase tracking-widest block mb-1">
                INQUIRY REGISTERED!
              </span>
              <p className="text-xs font-black text-white leading-tight">
                Ride reference #{createdInquiry?.id || 'KOV_INQ'} saved successfully!
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                We are assigning a driver. For manual updates, dial:
              </p>
              <a 
                href="tel:9043743777" 
                className="inline-block mt-1 text-xs font-black text-brand-yellow font-mono hover:underline"
              >
                +91 90437 43777
              </a>
            </div>

            <button 
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition shrink-0 cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
