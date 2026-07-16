import React, { useState, useEffect } from 'react';

const FALLBACK_MAP: Record<string, string> = {
  'fleet-sedan.png': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
  'fleet-suv-prime.png': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
  'fleet-suv-premium.png': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80',
  'dest-ooty.png': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
  'dest-munnar.png': 'https://images.unsplash.com/photo-1506461883276-594a12b11db3?auto=format&fit=crop&w=800&q=80',
  'dest-kodaikanal.png': 'https://images.unsplash.com/photo-1626596145552-4e4b7b4a243d?auto=format&fit=crop&w=800&q=80',
  'dest-coorg.png': 'https://images.unsplash.com/photo-1583262648834-8c08fb180373?auto=format&fit=crop&w=800&q=80',
  'dest-wayanad.png': 'https://images.unsplash.com/photo-1616843511100-34863bc4bc22?auto=format&fit=crop&w=800&q=80',
  'dest-valparai.png': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'dest-coonoor.png': 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
  'dest-mysore.png': 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80',
  'dest-adiyogi.png': 'https://images.unsplash.com/photo-1609137144814-7f15b81e815a?auto=format&fit=crop&w=800&q=80',
  'dest-madurai.png': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  'blog-ooty.png': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
  'blog-munnar-kodai.png': 'https://images.unsplash.com/photo-1506461883276-594a12b11db3?auto=format&fit=crop&w=800&q=80',
  'blog-tips.png': 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=800&q=80',
  'blog-valparai.png': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
};

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

  return (
    <div className={`relative overflow-hidden w-full h-full bg-slate-900/10 ${containerClassName}`}>
      {/* Shimmering Skeleton Loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-750 dark:to-slate-800 animate-pulse flex items-center justify-center">
          {/* Subtle logo/icon inside the loading state */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
          <span className="text-xl opacity-30 select-none">🚖</span>
        </div>
      )}

      {/* Fallback state in case image fails to load */}
      {hasError ? (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center text-center p-4">
          <span className="text-2xl mb-1">📸</span>
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Image Unavailable</span>
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
