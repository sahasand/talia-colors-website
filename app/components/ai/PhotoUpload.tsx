'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { UserPhoto } from './types';

interface PhotoUploadProps {
  onPhotoUpload: (photo: UserPhoto) => void;
  onBack: () => void;
}

const PhotoUpload = ({ onPhotoUpload, onBack }: PhotoUploadProps) => {
  const t = useTranslations('photoUpload');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
  }>>([]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const magneticX = useTransform(mouseX, [-200, 200], [-20, 20]);
  const magneticY = useTransform(mouseY, [-200, 200], [-10, 10]);

  // Note: Blob URL cleanup is now handled by AIColorPickerSection
  // to prevent premature cleanup before image is displayed in ColorRecommendations


  const validateFile = useCallback((file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      alert(t('validation.invalidType'));
      return false;
    }
    
    if (file.size > maxSize) {
      alert(t('validation.tooLarge'));
      return false;
    }
    
    return true;
  }, [t]);

  const processFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;
    
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    
    try {
      // Note: Blob URL will be cleaned up by AIColorPickerSection when workflow resets
      
      // Create success particles
      const successParticles = [...Array(12)].map((_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50 + (Math.random() - 0.5) * 20,
        color: `hsl(${Math.random() * 60 + 120}, 70%, 60%)`,
        size: 4 + Math.random() * 6
      }));
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const preview = URL.createObjectURL(file);
      
      setUploadSuccess(true);
      setParticles(successParticles);
      
      setTimeout(() => {
        const userPhoto: UserPhoto = {
          file,
          preview,
          timestamp: Date.now()
        };
        
        setIsUploading(false);
        onPhotoUpload(userPhoto);
      }, 1500);
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadError('Failed to process the uploaded image. Please try again.');
      setIsUploading(false);
    }
  }, [onPhotoUpload, validateFile]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl"
    >
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{t('title')}</h3>
        <p className="text-gray-600 text-base sm:text-lg px-4 sm:px-0">
          {t('description')}
        </p>
      </div>

      {/* Advanced Upload Area with Magnetic Field */}
      <motion.div
        className={`relative border-3 border-dashed rounded-2xl p-6 sm:p-8 md:p-12 text-center transition-all duration-300 overflow-hidden ${
          isDragging
            ? 'border-purple-500 bg-purple-50 scale-105'
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-25'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouseX.set(e.clientX - rect.left - rect.width / 2);
          mouseY.set(e.clientY - rect.top - rect.height / 2);
        }}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        animate={{
          scale: isDragging ? 1.02 : 1,
          boxShadow: isDragging 
            ? '0 20px 40px rgba(139, 69, 19, 0.15)' 
            : '0 10px 25px rgba(0, 0, 0, 0.08)'
        }}
        style={{
          x: magneticX,
          y: magneticY,
        }}
      >
        {/* Success Particles */}
        {uploadSuccess && (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  x: [(Math.random() - 0.5) * 200],
                  y: [(Math.random() - 0.5) * 200],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
        
        {/* Magnetic Field Indicator */}
        <motion.div
          className="absolute inset-0 border-2 border-purple-400 rounded-2xl opacity-0"
          animate={{
            opacity: isDragging ? 0.3 : 0,
            scale: isDragging ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        {isUploading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-base sm:text-lg text-purple-600 font-semibold">{t('processing')}</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="text-6xl mb-6"
              animate={{ 
                rotate: isDragging ? [0, -10, 10, 0] : 0,
                scale: isDragging ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              📸
            </motion.div>
            
            <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              {isDragging ? t('dragDrop.active') : t('dragDrop.default')}
            </h4>
            
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              {t('dragDrop.subtitle')}
            </p>
            
            <div className="flex justify-center">
              {/* Unified Upload Photo Button */}
              <motion.div
                className="relative group"
                whileHover="hover"
                whileTap="tap"
              >
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-full font-bold shadow-2xl overflow-hidden text-sm sm:text-base"
                  variants={{
                    hover: { 
                      scale: 1.1,
                      rotateY: 5,
                      boxShadow: "0 25px 50px rgba(139, 69, 19, 0.4)"
                    },
                    tap: { scale: 0.9 }
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  {/* Animated Gradient Background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                    variants={{
                      hover: { 
                        scale: 1.2,
                        rotate: 180,
                        opacity: 0.8
                      }
                    }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
                    variants={{
                      hover: {
                        x: ["-100%", "200%"]
                      }
                    }}
                    transition={{ duration: 1 }}
                  />
                  
                  {/* Button Content */}
                  <motion.span 
                    className="relative z-10 flex items-center gap-3"
                    variants={{
                      hover: { 
                        y: -2,
                        letterSpacing: "0.05em"
                      }
                    }}
                  >
                    <motion.span
                      variants={{
                        hover: { 
                          rotate: [0, -15, 15, 0],
                          scale: 1.3
                        }
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      📸
                    </motion.span>
                    <span className="hidden sm:inline">{t('buttons.uploadFull')}</span>
                    <span className="sm:hidden">{t('buttons.uploadShort')}</span>
                  </motion.span>
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>

      {/* Error Display */}
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <div className="flex items-center gap-2 text-red-800">
            <span className="text-lg">⚠️</span>
            <p className="text-sm font-medium">{uploadError}</p>
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center text-sm sm:text-base">
          💡 {t('tips.title')}
        </h4>
        <ul className="text-gray-600 space-y-1 sm:space-y-2 text-xs sm:text-sm">
          <li>• {t('tips.items.0')}</li>
          <li>• {t('tips.items.1')}</li>
          <li>• {t('tips.items.2')}</li>
          <li>• {t('tips.items.3')}</li>
        </ul>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-6 sm:mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-300"
        >
          ← {t('buttons.backToMain')}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PhotoUpload;