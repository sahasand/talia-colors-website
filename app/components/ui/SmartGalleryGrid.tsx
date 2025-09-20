'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Transformation {
  id: string;
  title: string;
  service: string;
  image: string;
  accentColor: string;
  textColor: string;
}

const SmartGalleryGrid = () => {
  const t = useTranslations('gallery');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Initialize component and detect screen size for responsive layout
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current && e.touches.length > 0) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      setMousePosition({ x, y });
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  // Enhanced touch handling for mobile magnetic effect
  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current && e.touches.length > 0) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      setMousePosition({ x, y });
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  // Simplified portfolio data using local images with curated styling
  const transformations: Transformation[] = [
    {
      id: '1',
      title: t('transformations.0.title'),
      service: t('transformations.0.service'),
      image: '/img1.png',
      accentColor: 'from-amber-400 to-yellow-300',
      textColor: 'text-amber-600'
    },
    {
      id: '2',
      title: t('transformations.1.title'),
      service: t('transformations.1.service'),
      image: '/img2.png',
      accentColor: 'from-yellow-400 to-amber-300',
      textColor: 'text-yellow-600'
    },
    {
      id: '3',
      title: t('transformations.2.title'),
      service: t('transformations.2.service'),
      image: '/img3.png',
      accentColor: 'from-slate-400 to-gray-300',
      textColor: 'text-slate-600'
    },
    {
      id: '4',
      title: t('transformations.3.title'),
      service: t('transformations.3.service'),
      image: '/img4.png',
      accentColor: 'from-amber-400 to-orange-300',
      textColor: 'text-amber-600'
    },
    {
      id: '5',
      title: t('transformations.4.title'),
      service: t('transformations.4.service'),
      image: '/img5.png',
      accentColor: 'from-stone-400 to-amber-300',
      textColor: 'text-stone-600'
    },
    {
      id: '6',
      title: t('transformations.5.title'),
      service: t('transformations.5.service'),
      image: '/img6.png',
      accentColor: 'from-purple-400 to-pink-300',
      textColor: 'text-purple-600'
    }
  ];

  // SSR fallback - render static version during server rendering
  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto relative">
        {/* Static Header */}
        <div className="text-center mb-20 relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-800 mb-4 tracking-tight relative z-10">
            {t('title')}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto w-24" />
        </div>

        {/* Static Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {transformations.map((transformation, index) => (
            <div key={transformation.id} className="group relative">
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4 sm:mb-6 bg-gradient-to-br from-gray-100 to-gray-200">
                <Image
                  src={transformation.image}
                  alt={transformation.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h3 className={`text-lg sm:text-xl md:text-2xl font-light tracking-tight ${transformation.textColor}`}>
                  {transformation.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="max-w-7xl mx-auto relative"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onMouseLeave={() => {
        setMousePosition({ x: 0, y: 0 });
        mouseX.set(0);
        mouseY.set(0);
      }}
      onTouchEnd={() => {
        setMousePosition({ x: 0, y: 0 });
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Advanced Typography Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 relative"
      >
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-800 mb-4 tracking-tight relative z-10"
          animate={{
            textShadow: hoveredId ? "0 0 30px rgba(139, 69, 19, 0.3)" : "none"
          }}
          transition={{ duration: 0.3 }}
        >
          {t('title')}
        </motion.h2>
        
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('subtitle')}
        </motion.p>
        
        {/* Dynamic Accent Line */}
        <motion.div 
          className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto relative"
          animate={{
            width: hoveredId ? "120px" : "96px",
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{
            width: { duration: 0.3 },
            backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
          }}
          style={{
            backgroundSize: "200% 200%"
          }}
        />
        
        {/* Floating Accent Particles */}
        {isMounted && [...Array(isMobile ? 3 : 6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${45 + i * 2}%`,
              top: `${60 + Math.sin(i) * 10}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>

      {/* Revolutionary 3D Gallery Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative"
        style={{
          perspective: "1000px"
        }}
      >
        {isMounted && transformations.map((transformation, index) => {
          // Calculate magnetic field effect using actual container dimensions
          let cardCenterX, cardCenterY;

          // Get actual container dimensions
          const containerRect = containerRef.current?.getBoundingClientRect();
          const containerWidth = containerRect?.width || 800;

          // Determine layout based on consistent breakpoints
          const isTablet = !isMobile && containerWidth < 1024;
          
          if (isMobile) {
            // Mobile: single column layout (< 768px)
            cardCenterX = containerWidth / 2;
            // Calculate card height based on 3:4 aspect ratio and actual width
            const cardWidth = containerWidth - 48; // Account for padding
            const cardHeight = (cardWidth * 4) / 3; // 3:4 aspect ratio
            const gap = 24; // gap-6 = 24px
            const marginBottom = 16; // mb-4 = 16px
            const headerHeight = 200; // Approximate header height
            cardCenterY = headerHeight + (index * (cardHeight + gap + marginBottom)) + (cardHeight / 2);
          } else if (isTablet) {
            // Tablet: 2 column layout (768px - 1024px)
            const cardWidth = (containerWidth - 40 - 48) / 2; // Account for gap and padding
            cardCenterX = (index % 2) * (cardWidth + 40) + (cardWidth / 2) + 24;
            const cardHeight = (cardWidth * 4) / 3;
            const gap = 40; // gap-10 = 40px
            cardCenterY = 200 + (Math.floor(index / 2) * (cardHeight + gap)) + (cardHeight / 2);
          } else {
            // Desktop: 3 column layout (>= 1024px)
            const cardWidth = (containerWidth - 96 - 48) / 3; // Account for gaps and padding
            cardCenterX = (index % 3) * (cardWidth + 48) + (cardWidth / 2) + 24;
            const cardHeight = (cardWidth * 4) / 3;
            const gap = 48; // gap-12 = 48px
            cardCenterY = 200 + (Math.floor(index / 3) * (cardHeight + gap)) + (cardHeight / 2);
          }
          
          const cardDistance = mousePosition.x ? Math.sqrt(
            Math.pow(mousePosition.x - cardCenterX, 2) + 
            Math.pow(mousePosition.y - cardCenterY, 2)
          ) : 1000;
          
          // Increased magnetic range for better mobile interaction
          const magneticRange = isMobile ? 150 : 100;
          const magneticEffect = Math.max(0, magneticRange - cardDistance) / magneticRange;
          
          return (
            <motion.div
              key={transformation.id}
              initial={{ opacity: 0, y: 60, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              className="group relative"
              style={{
                transformStyle: "preserve-3d",
                x: magneticEffect * (mousePosition.x > 0 ? (mousePosition.x - cardCenterX) / (isMobile ? 15 : 30) : 0),
                y: magneticEffect * (mousePosition.y > 0 ? (mousePosition.y - cardCenterY) / (isMobile ? 18 : 40) : 0),
              }}
            >
              {/* 3D Card Container */}
              <motion.div
                className="relative"
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setHoveredId(transformation.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTouchStart={() => setHoveredId(transformation.id)}
                onTouchEnd={() => setHoveredId(null)}
                variants={{
                  hover: {
                    rotateY: 8,
                    rotateX: 5,
                    scale: 1.05,
                    z: 100
                  },
                  tap: {
                    rotateY: 10,
                    rotateX: 6,
                    scale: 1.08,
                    z: 120
                  }
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                style={{
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Enhanced Image Container */}
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4 sm:mb-6 cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Main Image with Advanced Effects */}
                  <Image
                    src={transformation.image}
                    alt={transformation.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Dynamic Color Overlay */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${transformation.accentColor}`}
                    variants={{
                      hover: { 
                        opacity: 0.25,
                        scale: 1.1
                      },
                      tap: { 
                        opacity: 0.35,
                        scale: 1.15
                      }
                    }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Holographic Border Effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-white/30 rounded-2xl"
                    variants={{
                      hover: {
                        borderColor: "rgba(255,255,255,0.6)",
                        boxShadow: `0 0 30px ${transformation.accentColor.includes('purple') ? 'rgba(147, 51, 234, 0.5)' : transformation.accentColor.includes('pink') ? 'rgba(219, 39, 119, 0.5)' : transformation.accentColor.includes('blue') ? 'rgba(59, 130, 246, 0.5)' : transformation.accentColor.includes('yellow') ? 'rgba(245, 158, 11, 0.5)' : transformation.accentColor.includes('red') ? 'rgba(239, 68, 68, 0.5)' : 'rgba(139, 69, 19, 0.5)'}`
                      },
                      tap: {
                        borderColor: "rgba(255,255,255,0.8)",
                        boxShadow: `0 0 40px ${transformation.accentColor.includes('purple') ? 'rgba(147, 51, 234, 0.7)' : transformation.accentColor.includes('pink') ? 'rgba(219, 39, 119, 0.7)' : transformation.accentColor.includes('blue') ? 'rgba(59, 130, 246, 0.7)' : transformation.accentColor.includes('yellow') ? 'rgba(245, 158, 11, 0.7)' : transformation.accentColor.includes('red') ? 'rgba(239, 68, 68, 0.7)' : 'rgba(139, 69, 19, 0.7)'}`
                      }
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Advanced Text Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-4 sm:p-6"
                    variants={{
                      hover: { opacity: 1 },
                      tap: { opacity: 1 }
                    }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      variants={{
                        hover: { y: 0, opacity: 1 },
                        tap: { y: 0, opacity: 1 }
                      }}
                      initial={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <p className="text-white text-base sm:text-lg font-semibold mb-2">
                        {transformation.service}
                      </p>
                      <motion.div
                        className={`w-12 h-1 bg-gradient-to-r ${transformation.accentColor} rounded-full`}
                        variants={{
                          hover: { width: "80px", opacity: 1 },
                          tap: { width: "90px", opacity: 1 }
                        }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      />
                    </motion.div>
                  </motion.div>
                  
                  {/* Particle Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    variants={{
                      hover: { opacity: 1 },
                      tap: { opacity: 1 }
                    }}
                    initial={{ opacity: 0 }}
                  >
                    {isMounted && [...Array(isMobile ? 4 : 8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${20 + i * 10}%`,
                          top: `${20 + Math.sin(i) * 20}%`,
                        }}
                        variants={{
                          hover: {
                            scale: [0, 1.5, 0],
                            opacity: [0, 1, 0],
                            y: [0, -20]
                          },
                          tap: {
                            scale: [0, 2, 0],
                            opacity: [0, 1, 0],
                            y: [0, -30]
                          }
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Enhanced Typography */}
                <div className="space-y-2 sm:space-y-3 relative z-10">
                  <motion.h3 
                    className={`text-lg sm:text-xl md:text-2xl font-light tracking-tight transition-all duration-300 ${transformation.textColor}`}
                    variants={{
                      hover: { 
                        x: 8,
                        color: transformation.textColor.includes('blue') ? "#1d4ed8" : 
                              transformation.textColor.includes('purple') ? "#7c3aed" :
                              transformation.textColor.includes('yellow') ? "#d97706" :
                              transformation.textColor.includes('gray') ? "#374151" :
                              transformation.textColor.includes('red') ? "#dc2626" :
                              "#be185d",
                        textShadow: "0 4px 8px rgba(0,0,0,0.1)"
                      },
                      tap: { 
                        x: 12,
                        color: transformation.textColor.includes('blue') ? "#1d4ed8" : 
                              transformation.textColor.includes('purple') ? "#7c3aed" :
                              transformation.textColor.includes('yellow') ? "#d97706" :
                              transformation.textColor.includes('gray') ? "#374151" :
                              transformation.textColor.includes('red') ? "#dc2626" :
                              "#be185d",
                        textShadow: "0 6px 12px rgba(0,0,0,0.15)"
                      }
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {transformation.title}
                  </motion.h3>
                  
                  {/* Dynamic Accent Line */}
                  <motion.div
                    className={`h-1 bg-gradient-to-r ${transformation.accentColor} rounded-full`}
                    variants={{
                      hover: { 
                        width: "100px",
                        height: "3px"
                      },
                      tap: { 
                        width: "120px",
                        height: "4px"
                      }
                    }}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: hoveredId === transformation.id ? '80px' : '0px'
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default SmartGalleryGrid;