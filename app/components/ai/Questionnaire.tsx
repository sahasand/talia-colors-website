'use client';

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { UserPhoto, QuestionnaireData } from './types';

interface QuestionnaireProps {
  userPhoto: UserPhoto;
  onComplete: (data: QuestionnaireData) => void;
  onBack: () => void;
}

interface Question {
  id: keyof QuestionnaireData;
  title: string;
  description: string;
  options: Array<{
    value: string;
    label: string;
    description: string;
    emoji: string;
  }>;
}

export default function Questionnaire({ userPhoto, onComplete, onBack }: QuestionnaireProps) {
  const t = useTranslations('questionnaire');

  // Detect touch device
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Generate questions from translations with memoization
  const questions = useMemo((): Question[] => [
    {
      id: 'skinTone',
      title: t('questions.0.title'),
      description: t('questions.0.description'),
      options: [
        { value: 'fair', label: t('questions.0.options.0.label'), description: t('questions.0.options.0.description'), emoji: t('questions.0.options.0.emoji') },
        { value: 'medium', label: t('questions.0.options.1.label'), description: t('questions.0.options.1.description'), emoji: t('questions.0.options.1.emoji') },
        { value: 'olive', label: t('questions.0.options.2.label'), description: t('questions.0.options.2.description'), emoji: t('questions.0.options.2.emoji') },
        { value: 'dark', label: t('questions.0.options.3.label'), description: t('questions.0.options.3.description'), emoji: t('questions.0.options.3.emoji') }
      ]
    },
    {
      id: 'lifestyle',
      title: t('questions.1.title'),
      description: t('questions.1.description'),
      options: [
        { value: 'professional', label: t('questions.1.options.0.label'), description: t('questions.1.options.0.description'), emoji: t('questions.1.options.0.emoji') },
        { value: 'creative', label: t('questions.1.options.1.label'), description: t('questions.1.options.1.description'), emoji: t('questions.1.options.1.emoji') },
        { value: 'casual', label: t('questions.1.options.2.label'), description: t('questions.1.options.2.description'), emoji: t('questions.1.options.2.emoji') },
        { value: 'glamorous', label: t('questions.1.options.3.label'), description: t('questions.1.options.3.description'), emoji: t('questions.1.options.3.emoji') }
      ]
    },
    {
      id: 'maintenance',
      title: t('questions.2.title'),
      description: t('questions.2.description'),
      options: [
        { value: 'low', label: t('questions.2.options.0.label'), description: t('questions.2.options.0.description'), emoji: t('questions.2.options.0.emoji') },
        { value: 'medium', label: t('questions.2.options.1.label'), description: t('questions.2.options.1.description'), emoji: t('questions.2.options.1.emoji') },
        { value: 'high', label: t('questions.2.options.2.label'), description: t('questions.2.options.2.description'), emoji: t('questions.2.options.2.emoji') }
      ]
    },
    {
      id: 'currentHairColor',
      title: t('questions.3.title'),
      description: t('questions.3.description'),
      options: [
        { value: 'blonde', label: t('questions.3.options.0.label'), description: t('questions.3.options.0.description'), emoji: t('questions.3.options.0.emoji') },
        { value: 'brunette', label: t('questions.3.options.1.label'), description: t('questions.3.options.1.description'), emoji: t('questions.3.options.1.emoji') },
        { value: 'black', label: t('questions.3.options.2.label'), description: t('questions.3.options.2.description'), emoji: t('questions.3.options.2.emoji') },
        { value: 'red', label: t('questions.3.options.3.label'), description: t('questions.3.options.3.description'), emoji: t('questions.3.options.3.emoji') },
        { value: 'other', label: t('questions.3.options.4.label'), description: t('questions.3.options.4.description'), emoji: t('questions.3.options.4.emoji') }
      ]
    },
    {
      id: 'desiredVibe',
      title: t('questions.4.title'),
      description: t('questions.4.description'),
      options: [
        { value: 'natural', label: t('questions.4.options.0.label'), description: t('questions.4.options.0.description'), emoji: t('questions.4.options.0.emoji') },
        { value: 'bold', label: t('questions.4.options.1.label'), description: t('questions.4.options.1.description'), emoji: t('questions.4.options.1.emoji') },
        { value: 'subtle', label: t('questions.4.options.2.label'), description: t('questions.4.options.2.description'), emoji: t('questions.4.options.2.emoji') },
        { value: 'dramatic', label: t('questions.4.options.3.label'), description: t('questions.4.options.3.description'), emoji: t('questions.4.options.3.emoji') }
      ]
    },
    {
      id: 'experience',
      title: t('questions.5.title'),
      description: t('questions.5.description'),
      options: [
        { value: 'first-time', label: t('questions.5.options.0.label'), description: t('questions.5.options.0.description'), emoji: t('questions.5.options.0.emoji') },
        { value: 'occasional', label: t('questions.5.options.1.label'), description: t('questions.5.options.1.description'), emoji: t('questions.5.options.1.emoji') },
        { value: 'regular', label: t('questions.5.options.2.label'), description: t('questions.5.options.2.description'), emoji: t('questions.5.options.2.emoji') },
        { value: 'expert', label: t('questions.5.options.3.label'), description: t('questions.5.options.3.description'), emoji: t('questions.5.options.3.emoji') }
      ]
    }
  ], [t]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireData>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionSelect = useCallback((value: string) => {
    setSelectedOption(value);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
    
    // Auto-advance on touch devices
    if (isTouchDevice) {
      setIsAutoAdvancing(true);
      // Small delay to show selection feedback
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOption(answers[questions[currentQuestionIndex + 1].id] || '');
        } else {
          // Complete questionnaire
          const updatedAnswers = { ...answers, [currentQuestion.id]: value };
          const isComplete = questions.every(q => updatedAnswers[q.id]);
          if (isComplete) {
            onComplete(updatedAnswers as QuestionnaireData);
          }
        }
        setIsAutoAdvancing(false);
      }, 400);
    }
  }, [currentQuestion.id, isTouchDevice, currentQuestionIndex, questions, answers, onComplete]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(answers[questions[currentQuestionIndex + 1].id] || '');
    } else {
      // Complete questionnaire with validation
      const isComplete = questions.every(q => answers[q.id]);
      if (isComplete) {
        onComplete(answers as QuestionnaireData);
      } else {
        console.error('Questionnaire incomplete', answers);
      }
    }
  }, [currentQuestionIndex, questions, answers, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(answers[questions[currentQuestionIndex - 1].id] || '');
    } else {
      onBack();
    }
  }, [currentQuestionIndex, questions, answers, onBack]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl max-w-4xl mx-auto"
    >
      {/* Progress Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-4 border-purple-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={userPhoto.preview} 
                alt="Your photo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{t('title')}</h3>
              <p className="text-sm sm:text-base text-gray-600">{t('progressLabel', { current: currentQuestionIndex + 1, total: questions.length })}</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">{t('progressText')}</div>
            <div className="text-base sm:text-lg font-bold text-purple-600">{Math.round(progress)}%</div>
          </div>
        </div>
        
        {/* Advanced Progress Bar with Particle Trail */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Glowing Trail Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent rounded-full"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
          
          {/* Particle Progress Indicators */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
              style={{
                left: `${((i + 1) / questions.length) * 100}%`,
                transform: "translateY(-50%)"
              }}
              animate={{
                scale: progress >= ((i + 1) / questions.length) * 100 ? [1, 1.5, 1] : 1,
                opacity: progress >= ((i + 1) / questions.length) * 100 ? 1 : 0.3
              }}
              transition={{
                duration: 0.6,
                repeat: progress >= ((i + 1) / questions.length) * 100 ? Infinity : 0,
                repeatDelay: 1
              }}
            />
          ))}
        </div>
      </div>

      {/* 3D Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, rotateY: 90, z: -100 }}
          animate={{ opacity: 1, rotateY: 0, z: 0 }}
          exit={{ opacity: 0, rotateY: -90, z: -100 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-8 perspective-1000"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left - rect.width / 2);
            mouseY.set(e.clientY - rect.top - rect.height / 2);
          }}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          <h4 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 px-4 sm:px-0">
            {currentQuestion.title}
          </h4>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4 sm:px-0">
            {currentQuestion.description}
          </p>

          {/* Advanced 3D Options Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8 px-4 sm:px-0">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={option.value}
                className="relative group"
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, z: -50 }}
                animate={{ opacity: 1, z: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <motion.button
                  onClick={() => handleOptionSelect(option.value)}
                  className={`relative w-full p-4 sm:p-6 md:p-8 rounded-2xl border-2 text-left transition-all duration-500 overflow-hidden cursor-pointer active:scale-[0.98] ${
                    selectedOption === option.value
                      ? 'border-purple-500 bg-purple-50 shadow-2xl'
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                  }`}
                  variants={{
                    hover: { 
                      scale: 1.02,
                      rotateY: 5,
                      rotateX: 5,
                      z: 50,
                      boxShadow: "0 25px 50px rgba(139, 69, 19, 0.15)"
                    },
                    tap: { scale: 0.98 }
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
                  {/* Morphing Background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      selectedOption === option.value 
                        ? 'from-purple-100 to-pink-100 opacity-80'
                        : 'from-gray-50 to-gray-100 opacity-0'
                    }`}
                    variants={{
                      hover: { 
                        opacity: selectedOption === option.value ? 1 : 0.5,
                        scale: 1.1
                      }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Selection Ripple */}
                  {selectedOption === option.value && (
                    <motion.div
                      className="absolute inset-0 bg-purple-400/20 rounded-2xl"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  )}
                  
                  {/* Touch feedback overlay */}
                  {isTouchDevice && selectedOption === option.value && isAutoAdvancing && (
                    <motion.div
                      className="absolute inset-0 bg-purple-600/10 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-start gap-3 sm:gap-4 md:gap-6">
                    <motion.div 
                      className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0"
                      variants={{
                        hover: { 
                          scale: 1.2,
                          rotate: [0, -5, 5, 0],
                          z: 20
                        }
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {option.emoji}
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.h5 
                        className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3"
                        variants={{
                          hover: { 
                            x: 5,
                            color: selectedOption === option.value ? "#7c3aed" : "#1f2937"
                          }
                        }}
                      >
                        {option.label}
                      </motion.h5>
                      <motion.p 
                        className="text-sm sm:text-base text-gray-600 leading-relaxed"
                        variants={{
                          hover: { x: 5 }
                        }}
                      >
                        {option.description}
                      </motion.p>
                    </div>
                    
                    {/* Advanced Selection Indicator */}
                    <motion.div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedOption === option.value
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300 bg-white'
                      }`}
                      variants={{
                        hover: { 
                          scale: 1.1,
                          z: 20
                        }
                      }}
                    >
                      {selectedOption === option.value && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"
                        />
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0"
                    variants={{
                      hover: { opacity: 1 }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Back Button - Always visible for touch devices */}
      {isTouchDevice && (
        <div className="flex justify-start mb-4">
          <motion.button
            onClick={handlePrevious}
            className="flex items-center gap-2 px-6 py-3 min-h-[44px] bg-gray-100 text-gray-700 font-medium rounded-full active:scale-95 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <span>←</span>
            <span>
              {currentQuestionIndex === 0 ? t('navigation.backToUpload') : t('navigation.previous')}
            </span>
          </motion.button>
        </div>
      )}
      
      {/* Advanced Navigation Buttons - Desktop only or final question on mobile */}
      {(!isTouchDevice || currentQuestionIndex === questions.length - 1) && (
      <div className="flex justify-between items-center">
        {/* Previous Button */}
        <motion.button
          onClick={handlePrevious}
          className="relative flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] text-gray-600 hover:text-gray-800 font-medium transition-all duration-300 rounded-full group text-sm sm:text-base"
          whileHover={{ 
            scale: 1.05,
            x: -5
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gray-100 rounded-full scale-0 group-hover:scale-100 origin-center"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="relative z-10"
            animate={{
              x: [0, -3, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ←
          </motion.span>
          <span className="relative z-10">
            {currentQuestionIndex === 0 ? t('navigation.backToUpload') : t('navigation.previous')}
          </span>
        </motion.button>

        {/* Next/Analyze Button */}
        <motion.div
          className="relative group"
          whileHover="hover"
          whileTap="tap"
        >
          <motion.button
            onClick={handleNext}
            disabled={!selectedOption}
            className={`relative px-8 sm:px-10 md:px-12 py-4 sm:py-5 min-h-[48px] rounded-full font-bold transition-all duration-500 overflow-hidden text-base sm:text-lg ${
              selectedOption
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white shadow-2xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            variants={{
              hover: selectedOption ? { 
                scale: 1.1,
                rotateY: 5,
                boxShadow: "0 20px 40px rgba(139, 69, 19, 0.4)"
              } : {},
              tap: selectedOption ? { scale: 0.95 } : {}
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            {/* Progress Morphing Background */}
            {selectedOption && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                variants={{
                  hover: { 
                    scale: 1.2,
                    rotate: 180,
                    opacity: 1
                  }
                }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            )}
            
            {/* Content */}
            <motion.span 
              className="relative z-10 flex items-center gap-3"
              variants={{
                hover: selectedOption ? { 
                  x: 5,
                  letterSpacing: "0.05em"
                } : {}
              }}
            >
              {currentQuestionIndex === questions.length - 1 ? t('navigation.analyzeColors') : t('navigation.next')}
              <motion.span
                animate={selectedOption ? {
                  x: [0, 3, 0]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                →
              </motion.span>
            </motion.span>
            
            {/* Completion Sparkles */}
            {currentQuestionIndex === questions.length - 1 && selectedOption && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                variants={{
                  hover: { opacity: 1 }
                }}
                initial={{ opacity: 0 }}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    variants={{
                      hover: {
                        x: [0, (Math.cos(i * 60 * Math.PI / 180) * 40)],
                        y: [0, (Math.sin(i * 60 * Math.PI / 180) * 40)],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                      delay: i * 0.1
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.button>
        </motion.div>
      </div>
      )}

      {/* Auto-advance indicator for mobile */}
      <AnimatePresence>
        {isTouchDevice && isAutoAdvancing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mt-4 text-sm text-purple-600 font-medium flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"
            />
            {t('navigation.autoAdvancing')}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Question Indicators */}
      <div className="flex justify-center gap-1 sm:gap-2 mt-4 sm:mt-6">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentQuestionIndex
                ? 'bg-purple-600 scale-125'
                : index < currentQuestionIndex
                ? 'bg-purple-300'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

