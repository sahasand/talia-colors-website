'use client';

import { useState, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
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

  return (
    <div 
      ref={containerRef}
      className="max-w-7xl mx-auto relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
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
        {[...Array(6)].map((_, i) => (
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
        {transformations.map((transformation, index) => {
          // Calculate magnetic field effect for each card
          const cardDistance = mousePosition.x ? Math.sqrt(
            Math.pow(mousePosition.x - (index % 3) * 300 - 150, 2) + 
            Math.pow(mousePosition.y - Math.floor(index / 3) * 400 - 200, 2)
          ) : 1000;
          
          const magneticEffect = Math.max(0, 100 - cardDistance) / 100;
          
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
                x: magneticEffect * (mousePosition.x > 0 ? (mousePosition.x - 600) / 30 : 0),
                y: magneticEffect * (mousePosition.y > 0 ? (mousePosition.y - 400) / 40 : 0),
              }}
            >
              {/* 3D Card Container */}
              <motion.div
                className="relative"
                whileHover="hover"
                onMouseEnter={() => setHoveredId(transformation.id)}
                onMouseLeave={() => setHoveredId(null)}
                variants={{
                  hover: {
                    rotateY: 8,
                    rotateX: 5,
                    scale: 1.05,
                    z: 100
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
                      }
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Advanced Text Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-4 sm:p-6"
                    variants={{
                      hover: { opacity: 1 }
                    }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      variants={{
                        hover: { y: 0, opacity: 1 }
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
                          hover: { width: "80px", opacity: 1 }
                        }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      />
                    </motion.div>
                  </motion.div>
                  
                  {/* Particle Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    variants={{
                      hover: { opacity: 1 }
                    }}
                    initial={{ opacity: 0 }}
                  >
                    {[...Array(8)].map((_, i) => (
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