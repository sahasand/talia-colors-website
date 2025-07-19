'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const HeroSection = () => {
  const t = useTranslations('heroSection');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [touchingImage, setTouchingImage] = useState<number | null>(null);
  const [touchingButton, setTouchingButton] = useState(false);
  const [particles, setParticles] = useState<Array<{
    background: string;
    left: string;
    top: string;
    duration: number;
    delay: number;
  }>>([]);
  const [geometricShapes, setGeometricShapes] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    color: string;
    type: 'circle' | 'triangle' | 'square';
  }>>([]);
  const [imageParticles, setImageParticles] = useState<Array<{
    id: string;
    imageIndex: number;
    x: number;
    y: number;
    color: string;
    size: number;
    opacity: number;
    createdAt: number;
  }>>([]);
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 }); // Default desktop size
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Responsive values
  const isMobile = useMemo(() => screenSize.width < 640, [screenSize.width]);
  const isTablet = useMemo(() => screenSize.width >= 640 && screenSize.width < 1024, [screenSize.width]);
  
  const rotationIntensity = useMemo(() => {
    if (isMobile) return 0.3;
    if (isTablet) return 0.6;
    return 1;
  }, [isMobile, isTablet]);
  
  const particleCountMultiplier = useMemo(() => {
    if (isMobile) return 0.5; // Increased from 0.3 to 0.5 for more visible effects
    if (isTablet) return 0.75; // Increased from 0.6 to 0.75
    return 1;
  }, [isMobile, isTablet]);
  
  // Calculate image size offset for centering based on screen size
  const imageSizeOffset = useMemo(() => {
    if (isMobile) return 64;  // 32px * 2 (w-32 = 128px / 2)
    if (isTablet) return 80;  // 40px * 2 (w-40 = 160px / 2)
    if (screenSize.width < 1280) return 96;  // 48px * 2 (w-48 = 192px / 2)
    return 112;  // 56px * 2 (w-56 = 224px / 2)
  }, [isMobile, isTablet, screenSize.width]);
  
  // Transform mouse position for parallax effects
  const backgroundX = useTransform(mouseX, [0, 1920], [-50, 50]);
  const backgroundY = useTransform(mouseY, [0, 1080], [-30, 30]);
  const particleX = useTransform(mouseX, [0, 1920], [-20, 20]);
  const particleY = useTransform(mouseY, [0, 1080], [-15, 15]);
  const shapeX = useTransform(mouseX, [0, 1920], [-10, 10]);
  const shapeY = useTransform(mouseY, [0, 1080], [-10, 10]);
  
  // 3D rotation transforms for gallery with responsive intensity
  const rotateX = useTransform(mouseY, [0, 1080], [15 * rotationIntensity, -15 * rotationIntensity]);
  const rotateY = useTransform(mouseX, [0, 1920], [-20 * rotationIntensity, 20 * rotationIntensity]);
  const galleryX = useTransform(mouseX, [0, 1920], [-30 * rotationIntensity, 30 * rotationIntensity]);
  const galleryY = useTransform(mouseY, [0, 1080], [-20 * rotationIntensity, 20 * rotationIntensity]);
  
  
  
  // Hair transformation images with dominant colors (positions now calculated dynamically)
  const allHeroImages = useMemo(() => [
    { src: '/1a.png', colors: ['#8B4513', '#D2691E', '#F4A460'] },
    { src: '/2a.png', colors: ['#FFD700', '#FFA500', '#FF8C00'] },
    { src: '/3a.png', colors: ['#DC143C', '#FF1493', '#FF69B4'] },
    { src: '/4a.png', colors: ['#4B0082', '#8A2BE2', '#9400D3'] },
    { src: '/5a.png', colors: ['#00CED1', '#20B2AA', '#48D1CC'] },
    { src: '/6a.png', colors: ['#FF6347', '#FF4500', '#FF8C00'] },
    { src: '/7a.png', colors: ['#9370DB', '#8B7FD8', '#7B68EE'] },
    { src: '/8a.png', colors: ['#2E8B57', '#3CB371', '#00FA9A'] },
    { src: '/9a.png', colors: ['#B22222', '#CD5C5C', '#F08080'] },
    { src: '/10a.png', colors: ['#4682B4', '#5F9EA0', '#6495ED'] },
    { src: '/11a.png', colors: ['#DAA520', '#B8860B', '#FFD700'] }
  ], []);
  
  // Responsive image filtering
  const heroImages = useMemo(() => {
    if (isMobile) {
      // Show only 5 images on mobile
      return [allHeroImages[0], allHeroImages[2], allHeroImages[4], allHeroImages[6], allHeroImages[8]];
    } else if (isTablet) {
      // Show 8 images on tablet (skip every 3rd image)
      return allHeroImages.filter((_, index) => index % 3 !== 2);
    }
    // Show all images on desktop
    return allHeroImages;
  }, [isMobile, isTablet, allHeroImages]);
  
  // Dynamic 3D position calculation for circular carousel
  const calculateImagePosition = useCallback((imageIndex: number, totalImages: number, currentIndex: number) => {
    const relativeIndex = (imageIndex - currentIndex + totalImages) % totalImages;
    const angle = (relativeIndex / totalImages) * Math.PI * 2;
    
    // Responsive circle parameters - optimized for mobile display
    const radiusX = isMobile ? 80 : isTablet ? 160 : 200;
    const radiusZ = isMobile ? 60 : isTablet ? 120 : 150;
    const baseScale = isMobile ? 0.7 : isTablet ? 0.8 : 0.85;
    
    // Calculate position on circle
    const x = Math.sin(angle) * radiusX;
    const z = Math.cos(angle) * radiusZ - radiusZ; // Offset so front is at z=0
    const y = Math.sin(angle * 2) * 20; // Slight vertical variation
    
    // Scale based on distance (front images larger)
    const distanceFromFront = Math.abs(relativeIndex - 0) / (totalImages / 2);
    const scale = baseScale + (1 - baseScale) * Math.max(0, 1 - distanceFromFront);
    
    // Rotation to face center
    const rotateY = -angle * (180 / Math.PI);
    
    return {
      x,
      y,
      z,
      rotateY,
      scale,
      opacity: relativeIndex === 0 ? 1 : 0.7 + (0.3 * Math.max(0, 1 - distanceFromFront))
    };
  }, [isMobile, isTablet]);

  // Auto-rotation with intelligent pause/resume
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && heroImages.length > 0) {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length, isPaused]);
  
  // Resume auto-rotation after 10 seconds of inactivity
  useEffect(() => {
    if (isPaused) {
      const resumeTimer = setTimeout(() => {
        setIsPaused(false);
      }, 10000);
      return () => clearTimeout(resumeTimer);
    }
  }, [isPaused, lastInteraction]);
  
  // Manual navigation functions
  const goToImage = useCallback((index: number) => {
    if (heroImages.length === 0) return;
    const safeIndex = ((index % heroImages.length) + heroImages.length) % heroImages.length;
    setCurrentImageIndex(safeIndex);
    setIsPaused(true);
    setLastInteraction(Date.now());
    
    // Haptic feedback for image selection
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  }, [heroImages.length]);
  
  // Touch feedback handlers
  const handleImageTouchStart = (index: number) => {
    setTouchingImage(index);
  };
  
  const handleImageTouchEnd = () => {
    setTouchingImage(null);
  };
  
  const goToPrevious = useCallback(() => {
    const newIndex = currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1;
    goToImage(newIndex);
  }, [currentImageIndex, heroImages.length, goToImage]);
  
  const goToNext = useCallback(() => {
    const newIndex = (currentImageIndex + 1) % heroImages.length;
    goToImage(newIndex);
  }, [currentImageIndex, heroImages.length, goToImage]);
  
  // Touch/swipe gesture handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    
    // Prevent default behaviors that might interfere
    e.preventDefault();
    
    // Add haptic feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, []);
  
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    
    // Prevent scrolling during swipe
    e.preventDefault();
  }, []);
  
  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const velocity = Math.abs(distance) / 100; // Simple velocity calculation
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe || isRightSwipe) {
      // Enhanced haptic feedback based on swipe velocity
      if (navigator.vibrate) {
        const vibrationIntensity = Math.min(30, 15 + velocity * 10);
        navigator.vibrate(vibrationIntensity);
      }
      
      if (isLeftSwipe) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  }, [touchStart, touchEnd, goToNext, goToPrevious]);

  useEffect(() => {
    // Increased base particle counts for better mobile visibility
    const baseParticleCount = prefersReducedMotion ? 30 : 60;
    const particleCount = Math.floor(baseParticleCount * particleCountMultiplier);
    const particleData = [...Array(particleCount)].map(() => ({
      background: `hsl(${Math.random() * 360}, 70%, 60%)`,
      left: `${Math.random() * 90 + 5}%`, // Keep within 5-95% of viewport
      top: `${Math.random() * 90 + 5}%`, // Keep within 5-95% of viewport
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setParticles(particleData);
  }, [particleCountMultiplier, prefersReducedMotion]);

  // Initialize geometric shapes with performance optimization and viewport constraints
  useEffect(() => {
    const shapeCount = isMobile ? 6 : isTablet ? 8 : 10; // More shapes for visual richness
    const shapes = [...Array(shapeCount)].map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5, // Keep within 5-95% of viewport
      y: Math.random() * 90 + 5, // Keep within 5-95% of viewport
      size: isMobile ? 15 + Math.random() * 25 : 20 + Math.random() * 40,
      rotation: Math.random() * 360,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      type: ['circle', 'triangle', 'square'][Math.floor(Math.random() * 3)] as 'circle' | 'triangle' | 'square',
    }));
    setGeometricShapes(shapes);
  }, [isMobile, isTablet]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };

    const currentHeroRef = heroRef.current;
    if (currentHeroRef) {
      currentHeroRef.addEventListener('mousemove', handleMouseMove);
      return () => {
        currentHeroRef.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [mouseX, mouseY]);

  // Generate particles when active image changes (optimized for performance)
  useEffect(() => {
    // Generate particles even with reduced motion, but fewer and with simpler animations
    // This ensures mobile users still see beautiful effects
    
    // Ensure currentImageIndex is within bounds of heroImages array
    const safeIndex = currentImageIndex % heroImages.length;
    const currentImage = heroImages[safeIndex];
    
    // Safety check in case heroImages is empty or undefined
    if (!currentImage || !currentImage.colors) return;
    
    const currentImagePosition = calculateImagePosition(safeIndex, heroImages.length, safeIndex);
    const baseParticleCount = isMobile ? 10 : 15; // Increased for better visibility
    const particleCount = Math.floor(baseParticleCount * particleCountMultiplier);
    const newParticles: Array<{
      id: string;
      imageIndex: number;
      x: number;
      y: number;
      color: string;
      size: number;
      opacity: number;
      createdAt: number;
    }> = [];
    
    for (let i = 0; i < particleCount; i++) {
      const color = currentImage.colors[Math.floor(Math.random() * currentImage.colors.length)];
      
      // Constrain particles within viewport bounds with better mobile constraints
      const maxX = typeof window !== 'undefined' ? window.innerWidth - 40 : 1900;
      const maxY = typeof window !== 'undefined' ? window.innerHeight - 40 : 1060;
      const centerX = (typeof window !== 'undefined' ? window.innerWidth : 1920) / 2;
      const centerY = (typeof window !== 'undefined' ? window.innerHeight : 1080) / 2;
      
      // More restrictive bounds for mobile
      const minBound = 40;
      const maxBoundX = maxX - 40;
      const maxBoundY = maxY - 40;
      
      const particleX = Math.max(minBound, Math.min(maxBoundX, centerX + currentImagePosition.x * 0.8));
      const particleY = Math.max(minBound, Math.min(maxBoundY, centerY + currentImagePosition.y * 0.8));
      
      newParticles.push({
        id: `${Date.now()}-${i}`,
        imageIndex: safeIndex,
        x: particleX,
        y: particleY,
        color,
        size: isMobile ? 1.5 + Math.random() * 1.5 : 2 + Math.random() * 2,
        opacity: 1,
        createdAt: Date.now(),
      });
    }
    
    setImageParticles(prev => [...prev, ...newParticles]);
  }, [currentImageIndex, heroImages, particleCountMultiplier, prefersReducedMotion, isMobile, calculateImagePosition]);

  // Clean up old particles with optimized interval
  useEffect(() => {
    const intervalTime = isMobile ? 200 : 100; // Less frequent cleanup on mobile
    const interval = setInterval(() => {
      setImageParticles(prev => 
        prev.filter(particle => Date.now() - particle.createdAt < 2000)
      );
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [isMobile]);

  // Track screen size and reduced motion preference
  useEffect(() => {
    setIsMounted(true);
    
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      return mediaQuery;
    };
    
    // Initial size with SSR protection
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      
      const mediaQuery = checkReducedMotion();
      mediaQuery.addEventListener('change', (e) => setPrefersReducedMotion(e.matches));
      
      return () => {
        window.removeEventListener('resize', handleResize);
        mediaQuery.removeEventListener('change', (e) => setPrefersReducedMotion(e.matches));
      };
    }
  }, []);

  // Initialize mouse position to center of screen
  useEffect(() => {
    if (typeof window !== 'undefined' && heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    }
  }, [mouseX, mouseY, screenSize]);

  // Apply background images after mount to avoid hydration issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const imageElements = document.querySelectorAll('[data-bg-image]');
      imageElements.forEach((element) => {
        const bgImage = element.getAttribute('data-bg-image');
        if (bgImage && element instanceof HTMLElement) {
          element.style.backgroundImage = `url(${bgImage})`;
          element.style.backgroundSize = 'cover';
          element.style.backgroundPosition = 'center';
        }
      });
    }
  }, [heroImages]);

  return (
    <div ref={heroRef} className="relative w-full min-h-[calc(100vh-3rem)] sm:min-h-screen hero-mobile-optimized flex items-center justify-center overflow-hidden py-2 sm:py-8 md:py-12">
      {/* Gradient Overlay Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-pink-600/10 animate-pulse" />
      
      {/* Morphing Blob Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-cyan-500/20"
        style={{
          x: isMobile ? 0 : backgroundX,
          y: isMobile ? 0 : backgroundY,
        }}
      />
      
      {/* Geometric Shapes Layer */}
      <div className="absolute inset-0">
        {geometricShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute opacity-20"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
              x: isMobile ? 0 : shapeX,
              y: isMobile ? 0 : shapeY,
            }}
            animate={prefersReducedMotion ? {
              opacity: [0.2, 0.3, 0.2],
            } : {
              rotate: [shape.rotation, shape.rotation + 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { 
                duration: 15, 
                repeat: prefersReducedMotion ? 1 : Infinity, 
                ease: "linear" 
              },
              scale: { 
                duration: 4, 
                repeat: prefersReducedMotion ? 1 : Infinity, 
                ease: "easeInOut" 
              },
              opacity: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              },
              x: { type: "spring", stiffness: 50 },
              y: { type: "spring", stiffness: 50 },
            }}
          >
            {shape.type === 'circle' && (
              <div 
                className="w-full h-full rounded-full border-2"
                style={{ borderColor: shape.color }}
              />
            )}
            {shape.type === 'triangle' && (
              <div 
                className="w-full h-full"
                style={{ 
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  backgroundColor: shape.color
                }}
              />
            )}
            {shape.type === 'square' && (
              <div 
                className="w-full h-full border-2 rotate-45"
                style={{ borderColor: shape.color }}
              />
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Image Particle Trails */}
      <div className="absolute inset-0 pointer-events-none">
        {imageParticles.map((particle) => {
          const age = (Date.now() - particle.createdAt) / 2000; // 0 to 1 over 2 seconds
          const opacity = particle.opacity * (1 - age);
          const scale = particle.size * (1 + age * 2);
          const disperseX = (Math.random() - 0.5) * 100 * age;
          const disperseY = -50 * age + (Math.random() - 0.5) * 50 * age;
          
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full particle-trail hair-particle"
              style={{
                left: particle.x,
                top: particle.y,
                width: scale,
                height: scale * 3, // Elongated like hair strands
                backgroundColor: particle.color,
                opacity,
                transform: `translate(${disperseX}px, ${disperseY}px) rotate(${Math.random() * 360}deg)`,
                filter: 'blur(0.5px)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </div>
      
      {/* Enhanced Floating Color Particles */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        style={{
          x: isMobile ? 0 : particleX,
          y: isMobile ? 0 : particleY,
        }}
      >
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full blur-sm"
            style={{
              background: particle.background,
              left: particle.left,
              top: particle.top,
            }}
            animate={prefersReducedMotion ? {
              opacity: [0.3, 0.6, 0.3],
            } : {
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: particle.duration,
              repeat: prefersReducedMotion ? 1 : Infinity,
              delay: particle.delay,
            }}
            whileHover={!prefersReducedMotion ? {
              scale: 2,
              opacity: 1,
            } : {}}
          />
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-4 sm:mb-6 md:mb-8"
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <motion.span 
              className="bg-gradient-to-r from-purple-600 via-pink-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent animate-pulse-color"
              style={{
                backgroundSize: '200% 200%',
              }}
              whileHover={{
                scale: 1.05,
                textShadow: '0 0 30px rgba(139, 69, 19, 0.5)',
              }}
            >
              {t('title')}
            </motion.span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-700 mb-2 sm:mb-3"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {t('tagline')}
            </motion.p>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {t('description')}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* 3D Floating Gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] mx-auto mb-4 sm:mb-6 md:mb-8"
          style={{
            perspective: '1000px',
            perspectiveOrigin: '50% 50%',
            overflow: 'hidden',
            maxWidth: '100vw',
            contain: 'layout',
          }}
        >
          {/* Navigation Arrows */}
          <motion.button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isPaused ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: isPaused ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
          <motion.div
            className="relative w-full h-full gallery-3d"
            style={{
              transformStyle: 'preserve-3d',
              x: prefersReducedMotion ? 0 : (isMobile ? 0 : galleryX),
              y: prefersReducedMotion ? 0 : (isMobile ? 0 : galleryY),
              rotateX: prefersReducedMotion ? 0 : (isMobile ? 0 : rotateX),
              rotateY: prefersReducedMotion ? 0 : (isMobile ? 0 : rotateY),
              touchAction: 'none', // Prevent default touch behaviors
              userSelect: 'none', // Prevent text selection
              overflow: 'visible',
              maxWidth: '100%',
              position: 'relative',
            }}
            transition={{
              type: "spring",
              stiffness: prefersReducedMotion ? 100 : 50,
              damping: prefersReducedMotion ? 30 : 20
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {heroImages.map((image, index) => {
              const staggerDelay = index * 0.1;
              
              return (
                <motion.div
                  key={index}
                  className="absolute w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden shadow-2xl gallery-3d-item cursor-pointer"
                  data-bg-image={image.src}
                  style={{
                    left: '50%',
                    top: '50%',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                    // Enhanced touch target padding
                    padding: '8px',
                    margin: '-8px',
                    // Note: Depth-based responsiveness handled in animate props instead of transforms
                  }}
                  initial={ isMounted ? (() => {
                      const pos = calculateImagePosition(index, heroImages.length, 0); // Start from position 0
                      return {
                        opacity: 0,
                        x: pos.x - imageSizeOffset,
                        y: pos.y - imageSizeOffset,
                        translateZ: pos.z,
                        rotateY: pos.rotateY,
                        scale: pos.scale
                      };
                    })() : {
                      opacity: 0,
                      x: 0,
                      y: 0,
                      translateZ: 0,
                      rotateY: 0,
                      scale: 1
                    }
                  }
                  animate={ isMounted ? (() => {
                      const pos = calculateImagePosition(index, heroImages.length, currentImageIndex);
                      return {
                        opacity: touchingImage === index ? pos.opacity * 0.8 : pos.opacity,
                        filter: index === currentImageIndex ? 'brightness(1.2)' : 'brightness(0.8)',
                        x: pos.x - imageSizeOffset,
                        y: prefersReducedMotion ? pos.y - imageSizeOffset : [pos.y - imageSizeOffset, pos.y - imageSizeOffset - 10, pos.y - imageSizeOffset],
                        translateZ: pos.z,
                        rotateY: pos.rotateY,
                        rotateZ: prefersReducedMotion ? 0 : [0, 2, -2, 0],
                        scale: touchingImage === index ? pos.scale * 0.9 : (index === currentImageIndex ? pos.scale * 1.1 : pos.scale)
                      };
                    })() : {
                      opacity: index === currentImageIndex ? 1 : 0.7,
                      filter: index === currentImageIndex ? 'brightness(1.2)' : 'brightness(0.8)',
                      x: 0,
                      y: 0,
                      translateZ: 0,
                      rotateY: 0,
                      rotateZ: 0,
                      scale: index === currentImageIndex ? 1.1 : 1
                    }
                  }
                  transition={{ 
                    opacity: { duration: 1, delay: staggerDelay },
                    filter: { duration: 1, delay: staggerDelay },
                    x: { 
                      type: "spring", 
                      stiffness: 60, 
                      damping: 25,
                      duration: 1.5
                    },
                    y: prefersReducedMotion ? { 
                      type: "spring", 
                      stiffness: 60, 
                      damping: 25,
                      duration: 1.5
                    } : {
                      duration: 4 + index * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: staggerDelay
                    },
                    translateZ: { 
                      type: "spring", 
                      stiffness: 60, 
                      damping: 25,
                      duration: 1.5
                    },
                    rotateY: { 
                      type: "spring", 
                      stiffness: 60, 
                      damping: 25,
                      duration: 1.5
                    },
                    rotateZ: prefersReducedMotion ? { duration: 0 } : {
                      duration: 6 + index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: staggerDelay
                    },
                    scale: { 
                      type: "spring", 
                      stiffness: 60, 
                      damping: 25,
                      duration: 1.5
                    }
                  }}
                  whileHover={isMounted ? {
                    scale: calculateImagePosition(index, heroImages.length, currentImageIndex).scale * 1.1,
                    filter: 'brightness(1.3)',
                    transition: { duration: 0.3 }
                  } : {
                    scale: 1.1,
                    filter: 'brightness(1.3)',
                    transition: { duration: 0.3 }
                  }}
                  whileTap={isMounted ? {
                    scale: calculateImagePosition(index, heroImages.length, currentImageIndex).scale * 0.95,
                    transition: { duration: 0.1 }
                  } : {
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                  onClick={() => goToImage(index)}
                  onTouchStart={() => handleImageTouchStart(index)}
                  onTouchEnd={handleImageTouchEnd}
                  role="img"
                  aria-label={t(`imageAltTexts.${index % 3}`)}
                />
              );
            })}
          </motion.div>
        </motion.div>

        {/* Advanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex justify-center items-center mb-2 sm:mb-4"
        >
          {/* Magnetic Book Appointment Button */}
          <motion.div
            className="relative group"
            whileHover="hover"
            whileTap="tap"
          >
            <motion.button
              className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-full text-sm sm:text-base md:text-lg lg:text-xl font-bold shadow-2xl overflow-hidden group"
              onClick={() => {
                const message = encodeURIComponent(t('whatsapp.generalBooking'));
                window.open(`https://wa.me/554899169053?text=${message}`, '_blank');
              }}
              onTouchStart={() => {
                setTouchingButton(true);
                if (navigator.vibrate) {
                  navigator.vibrate(15);
                }
              }}
              onTouchEnd={() => {
                setTouchingButton(false);
              }}
              onTouchCancel={() => {
                setTouchingButton(false);
              }}
              variants={{
                hover: { 
                  scale: 1.1,
                  rotateY: 10,
                  rotateX: 5,
                  boxShadow: "0 20px 40px rgba(139, 69, 19, 0.4)"
                },
                tap: { 
                  scale: 1.05,
                  rotateY: 15,
                  rotateX: 8,
                  boxShadow: "0 25px 50px rgba(139, 69, 19, 0.5)"
                }
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              {/* Animated Background Layers */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 ${
                  touchingButton ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                variants={{
                  hover: { 
                    opacity: 1,
                    scale: 1.2,
                    rotate: 180
                  },
                  tap: { 
                    opacity: 1,
                    scale: 1.3,
                    rotate: 270
                  }
                }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Ripple Effect */}
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full scale-0"
                variants={{
                  hover: { 
                    scale: [0, 1.5],
                    opacity: [0.3, 0]
                  },
                  tap: { 
                    scale: [0, 2],
                    opacity: [0.5, 0]
                  }
                }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Button Content */}
              <motion.span 
                className="relative z-10 flex items-center gap-3"
                variants={{
                  hover: { 
                    y: -2,
                    letterSpacing: "0.05em"
                  },
                  tap: { 
                    y: -4,
                    letterSpacing: "0.08em"
                  }
                }}
              >
                <motion.svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                  variants={{
                    hover: { 
                      rotate: 360,
                      scale: 1.2
                    },
                    tap: { 
                      rotate: 540,
                      scale: 1.4
                    }
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.496"
                    fill="currentColor"
                  />
                </motion.svg>
                <span className="hidden sm:inline">{t('cta.bookAppointmentFull')}</span>
                <span className="sm:hidden">{t('cta.bookAppointmentShort')}</span>
              </motion.span>
              
              {/* Particle Burst Effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                variants={{
                  hover: {
                    opacity: 1
                  },
                  tap: {
                    opacity: 1
                  }
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: touchingButton ? 1 : 0 }}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    animate={touchingButton ? {
                      x: [0, (Math.cos(i * 60 * Math.PI / 180) * 60)],
                      y: [0, (Math.sin(i * 60 * Math.PI / 180) * 60)],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    } : {}}
                    variants={{
                      hover: {
                        x: [0, (Math.cos(i * 60 * Math.PI / 180) * 40)],
                        y: [0, (Math.sin(i * 60 * Math.PI / 180) * 40)],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      },
                      tap: {
                        x: [0, (Math.cos(i * 60 * Math.PI / 180) * 60)],
                        y: [0, (Math.sin(i * 60 * Math.PI / 180) * 60)],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: i * 0.1
                    }}
                  />
                ))}
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator - Hidden on small screens to save space */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-2 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-purple-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;