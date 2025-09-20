'use client';

import { motion, useMotionValue } from 'framer-motion';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const HeroSectionSimple = () => {
  const t = useTranslations('hero');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(0);
  const [touchingImage, setTouchingImage] = useState<number | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mouseX = useMotionValue(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mouseY = useMotionValue(0);

  // Responsive values
  const isMobile = useMemo(() => screenSize.width < 640, [screenSize.width]);
  const isTablet = useMemo(() => screenSize.width >= 640 && screenSize.width < 1024, [screenSize.width]);

  const imageSizeOffset = useMemo(() => {
    if (isMobile) return 56; // 112px / 2 (w-28 = 7rem = 112px)
    if (isTablet) return 96; // 192px / 2 (w-48 = 12rem = 192px)
    return 160; // 320px / 2 (w-80 = 20rem = 320px)
  }, [isMobile, isTablet]);

  const heroImages = useMemo(() => [
    { src: '/optimized/1a-thumb.webp', fallback: '/optimized/1a.jpg', colors: ['#8B4513', '#D2B48C'] },
    { src: '/optimized/2a-thumb.webp', fallback: '/optimized/2a.jpg', colors: ['#FFD700', '#FFA500'] },
    { src: '/optimized/3a-thumb.webp', fallback: '/optimized/3a.jpg', colors: ['#4B0082', '#8A2BE2'] },
    { src: '/optimized/4a-thumb.webp', fallback: '/optimized/4a.jpg', colors: ['#FF6347', '#FF4500'] },
    { src: '/optimized/5a-thumb.webp', fallback: '/optimized/5a.jpg', colors: ['#20B2AA', '#48D1CC'] },
    { src: '/optimized/6a-thumb.webp', fallback: '/optimized/6a.jpg', colors: ['#DA70D6', '#DDA0DD'] },
    { src: '/optimized/7a-thumb.webp', fallback: '/optimized/7a.jpg', colors: ['#F0E68C', '#FFE4B5'] },
    { src: '/optimized/8a-thumb.webp', fallback: '/optimized/8a.jpg', colors: ['#FFA07A', '#FA8072'] },
    { src: '/optimized/9a-thumb.webp', fallback: '/optimized/9a.jpg', colors: ['#98FB98', '#90EE90'] },
    { src: '/optimized/10a-thumb.webp', fallback: '/optimized/10a.jpg', colors: ['#FF69B4', '#FFB6C1'] },
    { src: '/optimized/11a-thumb.webp', fallback: '/optimized/11a.jpg', colors: ['#40E0D0', '#AFEEEE'] },
  ], []);

  const calculateImagePosition = useCallback((imageIndex: number, totalImages: number, currentIndex: number) => {
    const relativeIndex = (imageIndex - currentIndex + totalImages) % totalImages;
    const angle = (relativeIndex / totalImages) * Math.PI * 2;

    // Responsive circle parameters - optimized for mobile viewport
    const radiusX = isMobile ? 140 : isTablet ? 220 : 320;
    const radiusZ = isMobile ? 110 : isTablet ? 170 : 240;
    const baseScale = isMobile ? 0.45 : isTablet ? 0.75 : 0.9;

    // Calculate position on circle
    const x = Math.sin(angle) * radiusX;
    const z = Math.cos(angle) * radiusZ - radiusZ;
    const y = Math.sin(angle * 2) * 10; // Slight vertical variation

    // Scale based on distance
    const distanceFromFront = Math.abs(relativeIndex - 0) / (totalImages / 2);
    const scale = baseScale + (1 - baseScale) * Math.max(0, 1 - distanceFromFront);

    // Rotation to face center
    const rotateY = -angle * (180 / Math.PI);

    // Calculate z-index based on position in 3D space
    // Images closer to front (higher z value) get higher z-index
    const normalizedZ = (z + radiusZ * 2) / (radiusZ * 2); // Normalize z to 0-1
    const zIndex = relativeIndex === 0 ? 25 : Math.round(normalizedZ * 10); // Active image gets z-index 25 to overlap text

    return {
      x, y, z,
      scale,
      rotateY,
      opacity: relativeIndex === 0 ? 1 : 0.3 + (1 - distanceFromFront) * 0.5,
      zIndex
    };
  }, [isMobile, isTablet]);

  // Memoize all image positions to prevent recalculation on every render
  const imagePositions = useMemo(() => {
    return heroImages.map((_, index) =>
      calculateImagePosition(index, heroImages.length, currentImageIndex)
    );
  }, [heroImages, currentImageIndex, calculateImagePosition]);

  // Auto-rotation
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const interval = setInterval(() => {
      const timeSinceInteraction = Date.now() - lastInteraction;
      if (timeSinceInteraction > 10000) { // 10 seconds
        setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, prefersReducedMotion, lastInteraction, heroImages.length]);

  // Preload images for smoother transitions
  useEffect(() => {
    const preloadImages = () => {
      heroImages.forEach((image) => {
        const img = new Image();
        img.src = image.src;
        // Also preload fallback
        if (image.fallback) {
          const fallbackImg = new Image();
          fallbackImg.src = image.fallback;
        }
      });
    };
    preloadImages();
  }, [heroImages]);

  // Initialize with debounced resize handler
  useEffect(() => {
    setIsMounted(true);

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (typeof window !== 'undefined') {
          setScreenSize({ width: window.innerWidth, height: window.innerHeight });
        }
      }, 150); // Debounce resize events
    };

    const checkReducedMotion = () => {
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        return mediaQuery;
      }
      return null;
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);

      const mediaQuery = checkReducedMotion();
      if (mediaQuery) {
        mediaQuery.addEventListener('change', (e) => setPrefersReducedMotion(e.matches));
      }

      return () => {
        clearTimeout(resizeTimeout);
        window.removeEventListener('resize', handleResize);
        if (mediaQuery) {
          mediaQuery.removeEventListener('change', (e) => setPrefersReducedMotion(e.matches));
        }
      };
    }
  }, [heroImages]);

  const goToPrevious = () => {
    setCurrentImageIndex(prev => (prev - 1 + heroImages.length) % heroImages.length);
    setLastInteraction(Date.now());
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 15000);
  };

  const goToNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
    setLastInteraction(Date.now());
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 15000);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
    setLastInteraction(Date.now());
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 15000);
  };

  // SSR fallback - render on server and while mounting
  if (!isMounted || typeof window === 'undefined') {
    return (
      <div className="relative w-full min-h-[calc(100vh-3rem)] sm:min-h-screen hero-mobile-optimized flex items-center justify-center overflow-hidden py-2 sm:py-8 md:py-12">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center w-full">
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
              {t('title')}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={heroRef} className="relative w-full min-h-[calc(100vh-5rem)] sm:min-h-screen hero-mobile-optimized flex items-center justify-center overflow-hidden py-2 sm:py-4 md:py-8">
      {/* Simplified Background - removed dynamic elements for performance */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Static gradient only */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-purple-600/20 to-pink-600/15" />
      </div>
      
      {/* Navigation Arrows */}
      <motion.button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      <motion.button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 text-center w-full">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <motion.h1 
            className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-rainbow-animated leading-tight tracking-tight"
          style={{
            textShadow: '0 0 40px rgba(168, 85, 247, 0.3), 0 0 80px rgba(236, 72, 153, 0.2)',
            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.1))'
          }}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          {t('title')}
        </motion.h1>
        </div>
        
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white mb-2 sm:mb-3 md:mb-4"
          style={{
            textShadow: '0 4px 30px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6), 0 0 60px rgba(255,255,255,0.1)'
          }}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {t('tagline')}
        </motion.p>
        
        <motion.p 
          className="text-sm sm:text-base md:text-lg text-yellow-200 font-medium mb-3 sm:mb-4 md:mb-6"
          style={{
            textShadow: '0 2px 15px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)'
          }}
          initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {t('credentials')}
        </motion.p>
        
        <motion.p 
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 max-w-xl sm:max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed"
          style={{
            textShadow: '0 3px 25px rgba(0,0,0,0.7), 0 1px 5px rgba(0,0,0,0.5)'
          }}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {t('description')}
        </motion.p>

        {/* 3D Image Gallery - Mobile Optimized Heights */}
        <div className="relative w-full h-60 sm:h-72 md:h-[24rem] lg:h-[28rem] xl:h-[32rem] -mt-8 sm:-mt-10 md:-mt-6 lg:-mt-4 xl:mt-0 mb-2 sm:mb-0">
          <motion.div
            className="relative w-full h-full gallery-3d"
            style={{
              transformStyle: 'preserve-3d',
              perspective: isMobile ? '1000px' : '1500px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {heroImages.map((image, index) => {
              const pos = imagePositions[index];

              return (
                <motion.div
                  key={index}
                  className="absolute w-28 h-28 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-3xl overflow-hidden cursor-pointer group"
                  style={{
                    left: '50%',
                    top: '50%',
                    transformStyle: 'preserve-3d',
                    backgroundImage: `url(${image.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    // Simplified shadow - single layer instead of multiple
                    boxShadow: index === currentImageIndex
                      ? `0 25px 60px -12px rgba(0,0,0,0.5)`
                      : '0 15px 35px -10px rgba(0,0,0,0.3)',
                    border: index === currentImageIndex
                      ? `3px solid ${image.colors[0]}70`
                      : '1px solid rgba(255,255,255,0.1)',
                    // Removed backdrop filter for better performance
                    zIndex: pos.zIndex,
                    // Add will-change for smoother transitions
                    willChange: 'transform, opacity',
                  }}
                  initial={{
                    opacity: 0,
                    x: pos.x - imageSizeOffset,
                    y: pos.y - imageSizeOffset,
                    translateZ: pos.z,
                    rotateY: pos.rotateY,
                    scale: pos.scale
                  }}
                  animate={{
                    opacity: touchingImage === index ? pos.opacity * 0.9 : pos.opacity,
                    // Simplified filter - removed blur for performance
                    filter: index === currentImageIndex
                      ? 'brightness(1.1) saturate(1.15)'
                      : 'brightness(0.85)',
                    x: pos.x - imageSizeOffset,
                    y: pos.y - imageSizeOffset,
                    translateZ: pos.z,
                    rotateY: pos.rotateY,
                    // Reduced scale factor for better performance
                    scale: index === currentImageIndex ? pos.scale * 1.15 : pos.scale
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 60,
                    damping: 25,
                    duration: 1.5
                  }}
                  onClick={() => selectImage(index)}
                  onMouseEnter={() => setTouchingImage(index)}
                  onMouseLeave={() => setTouchingImage(null)}
                  whileHover={{ 
                    scale: pos.scale * 1.08,
                    rotateX: 5,
                    transition: { duration: 0.3, type: 'spring', stiffness: 300 }
                  }}
                  whileTap={{ 
                    scale: pos.scale * 0.92,
                    rotateX: -2,
                    transition: { duration: 0.1 }
                  }}
                />
              );
            })}
          </motion.div>
        </div>

        {/* CTA Button - Mobile Safe Positioning */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="relative group -mt-8 sm:-mt-12 md:-mt-10 lg:-mt-6 xl:-mt-4 mb-4 sm:mb-2 z-30"
          whileHover="hover"
          whileTap="tap"
        >
          <motion.button
            className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-semibold shadow-2xl overflow-hidden group"
            variants={{
              hover: { 
                scale: 1.15,
                rotateY: 15,
                rotateX: 10,
                boxShadow: "0 25px 50px rgba(139, 69, 19, 0.5)"
              },
              tap: { scale: 0.9 }
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            onClick={() => {
              const message = encodeURIComponent(`${t('whatsapp.greeting')} ${t('whatsapp.interest')}`);
              if (typeof window !== 'undefined') {
                window.open(`https://wa.me/554899169053?text=${message}`, '_blank');
              }
            }}
          >
            {/* Morphing Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
              variants={{
                hover: { 
                  scale: 1.3,
                  rotate: 180,
                  opacity: 1
                }
              }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            />
            
            {/* Pulsing Ring Effect */}
            <motion.div
              className="absolute inset-0 border-4 border-white/30 rounded-full"
              variants={{
                hover: { 
                  scale: [1, 1.2, 1.4],
                  opacity: [0.7, 0.3, 0]
                }
              }}
              transition={{ 
                duration: 1.2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            
            {/* Sparkle Effects - Reduced from 6 to 3 */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              variants={{
                hover: { opacity: 1 }
              }}
              initial={{ opacity: 0 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${25 + (i * 20)}%`,
                    left: `${20 + (i * 25)}%`,
                  }}
                  variants={{
                    hover: {
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      rotate: 360
                    }
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
            
            <span className="relative z-10 flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.496" fill="currentColor"/>
              </svg>
              <span className="hidden sm:inline">{t('cta.bookAppointmentFull')}</span>
              <span className="sm:hidden">{t('cta.bookAppointmentShort')}</span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSectionSimple;