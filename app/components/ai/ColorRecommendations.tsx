'use client';

import { motion } from 'framer-motion';
import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ColorRecommendation, UserPhoto } from './types';

interface ColorRecommendationsProps {
  recommendations: ColorRecommendation[];
  userPhoto: UserPhoto | null;
  onStartOver: () => void;
}

const ColorRecommendations = ({ 
  recommendations, 
  userPhoto, 
  onStartOver 
}: ColorRecommendationsProps) => {
  const t = useTranslations('colorRecommendations');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Debug logging
  console.log('ColorRecommendations received userPhoto:', userPhoto);
  console.log('UserPhoto preview URL:', userPhoto?.preview);
  
  // Get the top recommendation (highest confidence) with safety check
  const topRecommendation = useMemo(() => {
    return recommendations.length > 0 
      ? recommendations.reduce((prev, current) => 
          current.confidence > prev.confidence ? current : prev
        )
      : null;
  }, [recommendations]);

  const getMaintenanceIcon = useCallback((level: string) => {
    switch (level) {
      case 'low': return '🌿';
      case 'medium': return '⚡';
      case 'high': return '💅';
      default: return '⚡';
    }
  }, []);

  const getCategoryIcon = useCallback((category: string) => {
    switch (category) {
      case 'highlights': return '✨';
      case 'full-color': return '🎨';
      case 'balayage': return '🌅';
      case 'ombre': return '🌈';
      default: return '🎨';
    }
  }, []);

  // User Photo Component with error handling
  const UserPhotoDisplay = useCallback(() => {
    if (!userPhoto?.preview) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 sm:border-6 md:border-8 border-white shadow-2xl mx-auto lg:mx-0 mb-6 sm:mb-8 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">👤</div>
            <p className="text-sm text-gray-500">{t('placeholders.yourPhoto')}</p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 sm:border-6 md:border-8 border-white shadow-2xl mx-auto lg:mx-0 mb-6 sm:mb-8"
      >
        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}
        
        {/* Error state */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl mb-1">⚠️</div>
              <p className="text-xs text-red-600">{t('placeholders.failedToLoad')}</p>
            </div>
          </div>
        )}
        
        {/* Actual image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={userPhoto.preview} 
          alt="Your photo" 
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => {
            console.log('✅ User photo loaded successfully');
            setImageLoaded(true);
            setImageError(false);
          }}
          onError={(e) => {
            console.error('❌ Failed to load user photo:', e);
            console.log('Failed URL:', userPhoto.preview);
            console.log('URL still valid?', userPhoto.preview.startsWith('blob:'));
            setImageError(true);
            setImageLoaded(false);
          }}
          style={{
            minHeight: '100%',
            minWidth: '100%',
          }}
        />
      </motion.div>
    );
  }, [userPhoto?.preview, imageLoaded, imageError, t]);

  // Early return if no recommendations
  if (!topRecommendation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-2xl text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Recommendations Available</h2>
        <p className="text-gray-600 mb-6">We couldn&rsquo;t generate color recommendations. Please try again.</p>
        <button
          onClick={onStartOver}
          className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
        >
          Start Over
        </button>
      </motion.div>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="space-y-8"
    >
      {/* Hero Recommendation Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ 
          background: `linear-gradient(135deg, ${topRecommendation.hexCode}08, ${topRecommendation.hexCode}15)` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/80" />
        
        <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12">

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left: Photo and Personal Message */}
            <div className="text-center lg:text-left">
              <UserPhotoDisplay />
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-4 sm:mb-6">
                  {t('title')}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
                  {t('description')}
                </p>
                
                {/* Revolutionary Primary CTA */}
                <motion.div
                  className="relative group mb-6"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.button
                    onClick={() => window.open(`https://wa.me/554899169053?text=${t('whatsappMessage', { colorName: topRecommendation.name })}`, '_blank')}
                    className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-6 sm:px-10 md:px-16 py-4 sm:py-5 md:py-7 rounded-full text-lg sm:text-xl md:text-2xl font-bold shadow-2xl overflow-hidden"
                    variants={{
                      hover: { 
                        scale: 1.15,
                        rotateY: 10,
                        rotateX: 5,
                        boxShadow: "0 30px 60px rgba(16, 185, 129, 0.5)"
                      },
                      tap: { scale: 0.9 }
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                  >
                    {/* Success Aura Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400"
                      variants={{
                        hover: { 
                          scale: 1.3,
                          rotate: 180,
                          opacity: 1
                        }
                      }}
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                    />
                    
                    {/* Color Morphing Rings */}
                    <motion.div
                      className="absolute inset-0 border-4 border-white/30 rounded-full"
                      variants={{
                        hover: { 
                          scale: [1, 1.4, 1.8],
                          opacity: [0.6, 0.3, 0]
                        }
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                    
                    {/* Success Particle Explosion */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      variants={{
                        hover: { opacity: 1 }
                      }}
                      initial={{ opacity: 0 }}
                    >
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                          variants={{
                            hover: {
                              x: [0, (Math.cos(i * 36 * Math.PI / 180) * 80)],
                              y: [0, (Math.sin(i * 36 * Math.PI / 180) * 80)],
                              opacity: [0, 1, 0],
                              scale: [0, 2, 0],
                              rotate: [0, 360]
                            }
                          }}
                          transition={{
                            duration: 1.2,
                            ease: "easeOut",
                            delay: i * 0.08
                          }}
                        />
                      ))}
                    </motion.div>
                    
                    {/* Button Content */}
                    <motion.span 
                      className="relative z-10 flex items-center justify-center gap-4"
                      variants={{
                        hover: { 
                          y: -3,
                          letterSpacing: "0.1em",
                          textShadow: "0 0 30px rgba(255,255,255,0.8)"
                        }
                      }}
                    >
                      <motion.span
                        variants={{
                          hover: { 
                            rotate: 720,
                            scale: 1.5
                          }
                        }}
                        transition={{ duration: 1.2 }}
                      >
                        🌟
                      </motion.span>
                      <span className="hidden sm:inline">{t('cta.bookNowFull')}</span>
                      <span className="sm:hidden">{t('cta.bookNowShort')}</span>
                    </motion.span>
                    
                    {/* Shimmer Wave */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                      variants={{
                        hover: {
                          x: ["-100%", "200%"]
                        }
                      }}
                      transition={{ duration: 1 }}
                    />
                  </motion.button>
                </motion.div>
                
                <div className="text-center">
                  {/* Advanced Try Again Button */}
                  <motion.div
                    className="relative group"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.button
                      onClick={onStartOver}
                      className="relative bg-gradient-to-r from-gray-500 to-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-xl overflow-hidden text-sm sm:text-base"
                      variants={{
                        hover: { 
                          scale: 1.1,
                          rotateY: -8,
                          boxShadow: "0 20px 40px rgba(75, 85, 99, 0.4)"
                        },
                        tap: { scale: 0.9 }
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    >
                      {/* Rotating Background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-slate-400 to-gray-500"
                        variants={{
                          hover: { 
                            rotate: 360,
                            scale: 1.2
                          }
                        }}
                        transition={{ duration: 1 }}
                      />
                      
                      {/* Reset Ripple */}
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-full"
                        variants={{
                          hover: { 
                            scale: [0, 1.5],
                            opacity: [0.3, 0]
                          }
                        }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      {/* Content */}
                      <motion.span 
                        className="relative z-10 flex items-center gap-3"
                        variants={{
                          hover: { 
                            x: 3,
                            letterSpacing: "0.05em"
                          }
                        }}
                      >
                        <motion.span
                          variants={{
                            hover: { 
                              rotate: -360,
                              scale: 1.2
                            }
                          }}
                          transition={{ duration: 0.8 }}
                        >
                          🔄
                        </motion.span>
                        <span className="hidden sm:inline">{t('cta.tryAgainFull')}</span>
                        <span className="sm:hidden">{t('cta.tryAgainShort')}</span>
                      </motion.span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Right: Color Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              {/* Main Color Display */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl mb-4 sm:mb-6 relative overflow-hidden">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl">
                  {getCategoryIcon(topRecommendation.category)}
                </div>
                
                <div className="text-center mb-4 sm:mb-6">
                  <div 
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full mx-auto mb-3 sm:mb-4 border-4 sm:border-6 md:border-8 border-white shadow-2xl"
                    style={{ backgroundColor: topRecommendation.hexCode }}
                  />
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    {topRecommendation.name}
                  </h3>
                  <div className="font-mono text-sm sm:text-base md:text-lg text-gray-600 bg-gray-100 rounded-full px-3 sm:px-4 py-1 sm:py-2 inline-block">
                    {topRecommendation.hexCode}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-gray-700 text-center leading-relaxed mb-4 sm:mb-6 px-2 sm:px-0">
                  {topRecommendation.description}
                </p>

                {/* Key Details (No Price) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 rounded-lg p-2 sm:p-3">
                    <span className="text-sm sm:text-base">{getMaintenanceIcon(topRecommendation.maintenanceLevel)}</span>
                    <div>
                      <div className="font-semibold text-gray-800 text-xs sm:text-sm">{t('fields.maintenance')}</div>
                      <div className="text-gray-600 capitalize text-xs sm:text-sm">{topRecommendation.maintenanceLevel}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 rounded-lg p-2 sm:p-3">
                    <span className="text-sm sm:text-base">⏱️</span>
                    <div>
                      <div className="font-semibold text-gray-800 text-xs sm:text-sm">{t('fields.time')}</div>
                      <div className="text-gray-600 text-xs sm:text-sm">{topRecommendation.estimatedTime}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 rounded-lg p-2 sm:p-3">
                    <span className="text-sm sm:text-base">🎯</span>
                    <div>
                      <div className="font-semibold text-gray-800 text-xs sm:text-sm">{t('fields.category')}</div>
                      <div className="text-gray-600 capitalize text-xs sm:text-sm">{topRecommendation.category.replace('-', ' ')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 rounded-lg p-2 sm:p-3">
                    <span className="text-sm sm:text-base">📊</span>
                    <div>
                      <div className="font-semibold text-gray-800 text-xs sm:text-sm">{t('fields.match')}</div>
                      <div className="text-gray-600 text-xs sm:text-sm">{Math.round(topRecommendation.suitabilityScore)}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Process Details */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  🔬 {t('processTitle')}
                </h4>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {topRecommendation.process}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>



    </motion.div>
  );
};

export default ColorRecommendations;