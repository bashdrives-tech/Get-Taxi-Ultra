import React, { useState, useEffect } from 'react';

const FALLBACK_MAP: Record<string, string> = {};

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  loading?: 'lazy' | 'eager';
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  [key: string]: any;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  ...props
}: LazyImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
    setTriedFallback(false);
  }, [src]);

  const handleError = () => {
    if (!triedFallback && src) {
      const filename = src.replace(/^(\.\/|\/)/, '');
      const fallbackUrl = FALLBACK_MAP[filename] || FALLBACK_MAP[src];
      if (fallbackUrl && fallbackUrl !== src) {
        setTriedFallback(true);
        setCurrentSrc(fallbackUrl);
        return;
      }
    }
    setHasError(true);
  };

  const isFleet = src?.includes('fleet') || alt?.toLowerCase().includes('suv') || alt?.toLowerCase().includes('sedan') || alt?.toLowerCase().includes('ertiga') || alt?.toLowerCase().includes('innova') || alt?.toLowerCase().includes('crysta') || alt?.toLowerCase().includes('hycross');
  const isDest = src?.includes('dest') || alt?.toLowerCase().includes('ooty') || alt?.toLowerCase().includes('munnar') || alt?.toLowerCase().includes('kodaikanal') || alt?.toLowerCase().includes('coorg') || alt?.toLowerCase().includes('wayanad') || alt?.toLowerCase().includes('valparai') || alt?.toLowerCase().includes('coonoor') || alt?.toLowerCase().includes('mysore') || alt?.toLowerCase().includes('adiyogi') || alt?.toLowerCase().includes('madurai');
  const isBlog = src?.includes('blog') || alt?.toLowerCase().includes('blog') || alt?.toLowerCase().includes('guide') || alt?.toLowerCase().includes('tips');

  const displayName = alt || src?.split('/').pop()?.replace(/\.[^/.]+$/, "").replace(/-/g, ' ') || 'Get Taxi Kovai';

  return (
    <div className={`relative overflow-hidden w-full h-full bg-slate-950 ${containerClassName}`}>
      {/* Shimmering Skeleton Loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse flex items-center justify-center">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
          <span className="text-xl opacity-30 select-none">🚖</span>
        </div>
      )}

      {/* Beautiful Branded Placeholder fallback when image fails to load */}
      {hasError ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col items-center justify-center text-center p-4 border border-white/5 select-none">
          <div className="w-14 h-14 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 text-2xl mb-3 border border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.15)] animate-pulse">
            {isFleet ? '🚖' : isDest ? '🏔️' : isBlog ? '🧭' : '🚕'}
          </div>
          <h5 className="text-[12px] font-black text-yellow-400 uppercase tracking-widest px-3 py-1 rounded-lg bg-yellow-400/5 border border-yellow-400/10 max-w-[90%] truncate">
            {displayName}
          </h5>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 opacity-80">
            {isFleet ? 'Premium Service Vehicle' : isDest ? 'Sightseeing Destination' : 'Travel Guide & Blog'}
          </span>
          <span className="text-[8px] text-gray-600 font-medium uppercase tracking-wider mt-1">
            Get Taxi Kovai • Coimbatore
          </span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoaded 
              ? 'opacity-100 blur-0 scale-100' 
              : 'opacity-0 blur-lg scale-105'
          } ${className}`}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
}
