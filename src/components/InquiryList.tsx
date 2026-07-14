import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, RefreshCw, Calendar, Phone, Car, MapPin, ClipboardList, RefreshCwIcon } from 'lucide-react';
import { Inquiry } from '../types';

interface InquiryListProps {
  onClose: () => void;
}

export default function InquiryList({ onClose }: InquiryListProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      } else {
        setError('Failed to fetch inquiries from server');
      }
    } catch (err) {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-end"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 150 }}
        className="bg-white w-full max-w-xl h-full flex flex-col shadow-2xl border-l border-gray-100"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-yellow-400" />
            <div>
              <h3 className="font-bold text-base font-sans tracking-tight">Admin Inquiry Console</h3>
              <p className="text-[10px] text-gray-400">Incoming bookings for Get Taxi Kovai</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchInquiries}
              className="p-1.5 hover:bg-white/10 rounded-full transition cursor-pointer"
              title="Refresh logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2 border border-red-100">
              <span>⚠️ {error}</span>
            </div>
          )}

          {loading && inquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-gray-500 font-medium">Fetching inquiry submissions...</span>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-600">No Inquiries Found</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Any dynamic fare submissions entered in the Booking Form will display here in real time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider flex justify-between">
                <span>Total Received: {inquiries.length} inquiries</span>
                <span className="text-emerald-600">● Active</span>
              </p>
              
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition space-y-3 relative overflow-hidden"
                >
                  {/* Status Indicator */}
                  <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-850 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                    {inq.status}
                  </span>

                  {/* Ref ID & Name */}
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 block">{inq.id}</span>
                    <h4 className="font-extrabold text-sm text-slate-900">{inq.customerName}</h4>
                  </div>

                  {/* Contact Phone */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium font-mono">{inq.customerPhone}</span>
                  </div>

                  {/* Journey Specs */}
                  <div className="bg-gray-50 p-3 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="font-semibold text-slate-900">Pickup:</span>
                      <span className="truncate">{inq.pickupLocation}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold text-slate-900">Destination:</span>
                      <span className="truncate">{inq.dropLocation}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-900">Fleet Chosen:</span>
                      <span>{inq.vehicleType}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 pt-1.5 border-t border-gray-200">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Date: {inq.travelDate}
                      </span>
                      <span>Type: {inq.tripType === 'local' ? 'Local' : inq.tripType === 'one_way' ? 'One-Way' : `Roundtrip (${inq.daysNeeded}d)`}</span>
                    </div>
                  </div>

                  {/* Special note if available */}
                  {inq.specialRequests && (
                    <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] text-gray-500 italic">
                      " {inq.specialRequests} "
                    </div>
                  )}

                  {/* Estimated Pricing Lock */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Est. Locked Fare:</span>
                    <span className="font-extrabold text-sm text-slate-900 font-mono">
                      Rs. {inq.estimatedFare.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 text-center shrink-0 border-t border-gray-200">
          <p className="text-[10px] text-gray-400 font-mono">
            Get Taxi Kovai Admin panel v1.0. Connected.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
