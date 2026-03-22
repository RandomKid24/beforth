import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  containerClassName?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, containerClassName = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Start loading slightly before it comes into view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden bg-slate-200/50 ${containerClassName}`}
    >
      {/* Skeleton / Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 w-full h-full animate-pulse bg-slate-200/50" />
      )}
      
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ 
            opacity: isLoaded ? 1 : 0, 
            filter: isLoaded ? 'blur(0px)' : 'blur(10px)' 
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover ${className || ''}`}
          {...props}
        />
      )}
    </div>
  );
};
