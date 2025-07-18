'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import PhotoUpload from './PhotoUpload';
import Questionnaire from './Questionnaire';
import AIProcessing from './AIProcessing';
import ColorRecommendations from './ColorRecommendations';
import { WorkflowStep, UserPhoto, QuestionnaireData, ColorRecommendation } from './types';

const AIColorPickerSection = () => {
  const t = useTranslations('aiColorPicker');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [userPhoto, setUserPhoto] = useState<UserPhoto | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [recommendations, setRecommendations] = useState<ColorRecommendation[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Clean up blob URL when component unmounts or photo changes
  useEffect(() => {
    return () => {
      if (userPhoto?.preview) {
        try {
          URL.revokeObjectURL(userPhoto.preview);
        } catch (error) {
          // Blob URL may already be revoked
          console.warn('Failed to revoke blob URL:', error);
        }
      }
    };
  }, [userPhoto?.preview]);

  const steps = useMemo(() => [
    { id: 'upload', title: t('workflow.steps.0.title'), icon: t('workflow.steps.0.icon') },
    { id: 'questionnaire', title: t('workflow.steps.1.title'), icon: t('workflow.steps.1.icon') },
    { id: 'processing', title: t('workflow.steps.2.title'), icon: t('workflow.steps.2.icon') },
    { id: 'results', title: t('workflow.steps.3.title'), icon: t('workflow.steps.3.icon') }
  ], [t]);

  const handlePhotoUpload = useCallback((photo: UserPhoto) => {
    console.log('🎯 AIColorPickerSection received photo:', photo);
    setUserPhoto(photo);
    setCurrentStep('questionnaire');
  }, []);

  const handleQuestionnaireComplete = useCallback((data: QuestionnaireData) => {
    setQuestionnaireData(data);
    setCurrentStep('processing');
  }, []);

  const handleAIComplete = useCallback((results: ColorRecommendation[]) => {
    console.log('🤖 AI analysis complete, setting results step');
    console.log('📊 Current userPhoto state:', userPhoto);
    setRecommendations(results);
    setCurrentStep('results');
  }, [userPhoto]);

  const resetWorkflow = useCallback(() => {
    // Clean up blob URL if it exists
    if (userPhoto?.preview) {
      try {
        URL.revokeObjectURL(userPhoto.preview);
      } catch (error) {
        console.warn('Failed to revoke blob URL during reset:', error);
      }
    }
    
    setCurrentStep('upload');
    setUserPhoto(null);
    setQuestionnaireData(null);
    setRecommendations([]);
  }, [userPhoto?.preview]);

  const getCurrentStepIndex = useCallback(() => {
    return steps.findIndex(step => step.id === currentStep);
  }, [steps, currentStep]);

  if (!isVisible) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-cyan-600/5" />
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              {t('intro.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0">
              {t('intro.description')}
            </p>
            
            <motion.div
              className="relative group"
              whileHover="hover"
              whileTap="tap"
            >
              <motion.button
                onClick={() => setIsVisible(true)}
                className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-6 sm:px-10 md:px-16 py-4 sm:py-5 md:py-6 rounded-full text-lg sm:text-xl md:text-2xl font-bold shadow-2xl overflow-hidden group"
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
                
                {/* Sparkle Effects */}
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
                      className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      variants={{
                        hover: {
                          x: [0, (Math.cos(i * 45 * Math.PI / 180) * 60)],
                          y: [0, (Math.sin(i * 45 * Math.PI / 180) * 60)],
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                          rotate: [0, 360]
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
                
                {/* Button Text */}
                <motion.span 
                  className="relative z-10 flex items-center justify-center gap-4"
                  variants={{
                    hover: { 
                      y: -3,
                      letterSpacing: "0.1em",
                      textShadow: "0 0 20px rgba(255,255,255,0.8)"
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
                    transition={{ duration: 1 }}
                  >
                    ✨
                  </motion.span>
                  {t('intro.ctaButton')}
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-cyan-600/5" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            {t('workflow.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-4 sm:px-0">
            {t('workflow.description')}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative flex-1">
                <motion.div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold transition-all duration-300 ${
                    index <= getCurrentStepIndex()
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}
                  animate={{
                    scale: index === getCurrentStepIndex() ? 1.1 : 1,
                    boxShadow: index === getCurrentStepIndex() ? '0 10px 30px rgba(139, 69, 19, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {step.icon}
                </motion.div>
                <p className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                  index <= getCurrentStepIndex() ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-16 w-full h-0.5 bg-gray-200">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                      initial={{ width: '0%' }}
                      animate={{ 
                        width: index < getCurrentStepIndex() ? '100%' : '0%' 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 'upload' && (
              <PhotoUpload
                key="upload"
                onPhotoUpload={handlePhotoUpload}
                onBack={() => setIsVisible(false)}
              />
            )}
            
            {currentStep === 'questionnaire' && userPhoto && (
              <Questionnaire
                key="questionnaire"
                userPhoto={userPhoto}
                onComplete={handleQuestionnaireComplete}
                onBack={() => setCurrentStep('upload')}
              />
            )}
            
            {currentStep === 'processing' && userPhoto && questionnaireData && (
              <AIProcessing
                key="processing"
                userPhoto={userPhoto}
                questionnaireData={questionnaireData}
                onComplete={handleAIComplete}
              />
            )}
            
            {currentStep === 'results' && recommendations.length > 0 && (
              <ColorRecommendations
                key="results"
                recommendations={recommendations}
                userPhoto={userPhoto}
                onStartOver={resetWorkflow}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default AIColorPickerSection;