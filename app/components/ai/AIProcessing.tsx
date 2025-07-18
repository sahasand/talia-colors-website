'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { UserPhoto, QuestionnaireData, ColorRecommendation, AIAnalysisStep } from './types';

interface AIProcessingProps {
  userPhoto: UserPhoto;
  questionnaireData: QuestionnaireData;
  onComplete: (recommendations: ColorRecommendation[]) => void;
}

const AIProcessing = ({ userPhoto, questionnaireData, onComplete }: AIProcessingProps) => {
  const t = useTranslations('aiProcessing');
  
  const analysisSteps: AIAnalysisStep[] = useMemo(() => [
    {
      id: 'face-detection',
      message: t('steps.0.message'),
      progress: 15,
      duration: 1500
    },
    {
      id: 'color-analysis',
      message: t('steps.1.message'),
      progress: 35,
      duration: 2000
    },
    {
      id: 'style-matching',
      message: t('steps.2.message'),
      progress: 55,
      duration: 1800
    },
    {
      id: 'compatibility',
      message: t('steps.3.message'),
      progress: 75,
      duration: 1500
    },
    {
      id: 'recommendations',
      message: t('steps.4.message'),
      progress: 95,
      duration: 1200
    },
    {
      id: 'complete',
      message: t('steps.5.message'),
      progress: 100,
      duration: 800
    }
  ], [t]);

  // Generate realistic color recommendations based on questionnaire data
  const generateRecommendations = useCallback((data: QuestionnaireData): ColorRecommendation[] => {
    const baseRecommendations = [
      // Warm tones
      {
        id: 'caramel-highlights',
        name: t('recommendations.caramelHighlights.name'),
        description: t('recommendations.caramelHighlights.description'),
        hexCode: '#D2691E',
        category: 'highlights' as const,
        maintenanceLevel: 'medium' as const,
        process: t('recommendations.caramelHighlights.process'),
        estimatedTime: t('recommendations.caramelHighlights.estimatedTime'),
        price: t('recommendations.caramelHighlights.price'),
        confidence: 92,
        suitabilityScore: 85
      },
      {
        id: 'chocolate-brown',
        name: t('recommendations.chocolateBrown.name'),
        description: t('recommendations.chocolateBrown.description'),
        hexCode: '#7B3F00',
        category: 'full-color' as const,
        maintenanceLevel: 'low' as const,
        process: t('recommendations.chocolateBrown.process'),
        estimatedTime: t('recommendations.chocolateBrown.estimatedTime'),
        price: t('recommendations.chocolateBrown.price'),
        confidence: 88,
        suitabilityScore: 90
      },
      // Cool tones
      {
        id: 'ash-blonde',
        name: t('recommendations.ashBlonde.name'),
        description: t('recommendations.ashBlonde.description'),
        hexCode: '#C4B58D',
        category: 'full-color' as const,
        maintenanceLevel: 'high' as const,
        process: t('recommendations.ashBlonde.process'),
        estimatedTime: t('recommendations.ashBlonde.estimatedTime'),
        price: t('recommendations.ashBlonde.price'),
        confidence: 78,
        suitabilityScore: 75
      },
      {
        id: 'strawberry-blonde',
        name: t('recommendations.strawberryBlonde.name'),
        description: t('recommendations.strawberryBlonde.description'),
        hexCode: '#FF7F50',
        category: 'balayage' as const,
        maintenanceLevel: 'medium' as const,
        process: t('recommendations.strawberryBlonde.process'),
        estimatedTime: t('recommendations.strawberryBlonde.estimatedTime'),
        price: t('recommendations.strawberryBlonde.price'),
        confidence: 85,
        suitabilityScore: 82
      },
      // Bold options
      {
        id: 'burgundy-ombre',
        name: t('recommendations.burgundyOmbre.name'),
        description: t('recommendations.burgundyOmbre.description'),
        hexCode: '#800020',
        category: 'ombre' as const,
        maintenanceLevel: 'high' as const,
        process: t('recommendations.burgundyOmbre.process'),
        estimatedTime: t('recommendations.burgundyOmbre.estimatedTime'),
        price: t('recommendations.burgundyOmbre.price'),
        confidence: 70,
        suitabilityScore: 65
      },
      {
        id: 'copper-red',
        name: t('recommendations.copperRed.name'),
        description: t('recommendations.copperRed.description'),
        hexCode: '#B87333',
        category: 'full-color' as const,
        maintenanceLevel: 'high' as const,
        process: t('recommendations.copperRed.process'),
        estimatedTime: t('recommendations.copperRed.estimatedTime'),
        price: t('recommendations.copperRed.price'),
        confidence: 82,
        suitabilityScore: 78
      }
    ];

  // Filter and customize based on questionnaire responses
  return baseRecommendations
    .filter(rec => {
      // Filter by maintenance preference
      if (data.maintenance === 'low' && rec.maintenanceLevel === 'high') return false;
      if (data.maintenance === 'high' && rec.maintenanceLevel === 'low') return false;
      
      // Filter by lifestyle
      if (data.lifestyle === 'professional' && rec.name.includes('Burgundy')) return false;
      if (data.lifestyle === 'creative' && rec.name.includes('Ash')) return false;
      
      // Filter by desired vibe
      if (data.desiredVibe === 'natural' && rec.category === 'ombre') return false;
      if (data.desiredVibe === 'dramatic' && rec.maintenanceLevel === 'low') return false;
      
      return true;
    })
    .slice(0, 4) // Return top 4 recommendations
    .map(rec => ({
      ...rec,
      confidence: Math.max(65, rec.confidence + Math.random() * 10 - 5),
      suitabilityScore: Math.max(60, rec.suitabilityScore + Math.random() * 10 - 5)
    }))
    .sort((a, b) => b.confidence - a.confidence);
  }, [t]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < analysisSteps.length; i++) {
        const step = analysisSteps[i];
        setCurrentStepIndex(i);
        
        // Animate progress
        const startProgress = i === 0 ? 0 : analysisSteps[i - 1].progress;
        const targetProgress = step.progress;
        
        const progressDuration = step.duration;
        const progressSteps = 20;
        const progressIncrement = (targetProgress - startProgress) / progressSteps;
        
        for (let j = 0; j <= progressSteps; j++) {
          await new Promise(resolve => setTimeout(resolve, progressDuration / progressSteps));
          setProgress(startProgress + (progressIncrement * j));
        }
        
        if (i === analysisSteps.length - 1) {
          setAnalysisComplete(true);
          setTimeout(() => {
            const recommendations = generateRecommendations(questionnaireData);
            onComplete(recommendations);
          }, 1000);
        }
      }
    };

    processSteps();
  }, [questionnaireData, onComplete, analysisSteps, generateRecommendations]);

  const currentStep = analysisSteps[currentStepIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-200"
          animate={{ 
            scale: [1, 1.05, 1],
            borderColor: ['rgb(196, 181, 253)', 'rgb(168, 85, 247)', 'rgb(196, 181, 253)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={userPhoto.preview} 
            alt="Your photo" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          {t('title')}
        </h3>
        <p className="text-lg text-gray-600">
          {t('description')}
        </p>
      </div>

      {/* Advanced AI Visualization */}
      <div className="relative mb-12">
        {/* Neural Network Visualization */}
        <div className="relative flex justify-center mb-8">
          <div className="relative">
            {/* Outer Rotating Ring */}
            <motion.div
              className="w-52 h-52 rounded-full border-4 border-purple-300/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Middle Ring */}
            <motion.div
              className="absolute inset-4 rounded-full border-4 border-pink-300/60"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner Pulsing Core */}
            <motion.div
              className="absolute inset-8 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 relative overflow-hidden"
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 4, repeat: Infinity, ease: "linear" }
              }}
            >
              {/* AI Brain Pattern */}
              <motion.div
                className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"
                animate={{
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              {/* Neural Connections */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-8 bg-white/60 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: '50% 0%',
                    transform: `rotate(${i * 60}deg) translateX(-50%)`
                  }}
                  animate={{
                    scaleY: [0.5, 1.2, 0.5],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
            
            {/* Central AI Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center z-10">
                <motion.div 
                  className="text-4xl mb-3"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🧠
                </motion.div>
                <motion.div 
                  className="text-2xl font-bold text-white drop-shadow-lg"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(255,255,255,0.5)",
                      "0 0 20px rgba(139, 69, 19, 0.8)",
                      "0 0 10px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {Math.round(progress)}%
                </motion.div>
              </div>
            </div>
            
            {/* Floating Data Particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 120],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 120],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>

        {/* Advanced Progress Ring System */}
        <div className="relative w-72 h-72 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgb(229, 231, 235)"
              strokeWidth="6"
            />
            
            {/* Animated Progress Ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#advancedGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                pathLength: progress / 100,
                strokeDasharray: "283",
                filter: "drop-shadow(0 0 10px rgba(139, 69, 19, 0.6))"
              }}
            />
            
            {/* Particle Trail Ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#particleGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 4"
              animate={{ 
                strokeDashoffset: [0, -20],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            
            {/* Outer Glow Ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(139, 69, 19, 0.3)"
              strokeWidth="1"
              animate={{
                r: [48, 50, 48],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <defs>
              <linearGradient id="advancedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(147, 51, 234)" />
                <stop offset="25%" stopColor="rgb(219, 39, 119)" />
                <stop offset="50%" stopColor="rgb(6, 182, 212)" />
                <stop offset="75%" stopColor="rgb(16, 185, 129)" />
                <stop offset="100%" stopColor="rgb(245, 158, 11)" />
              </linearGradient>
              <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="50%" stopColor="rgba(139, 69, 19, 0.6)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Progress Indicator Particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${50 + Math.cos((i * 30 + progress * 3.6) * Math.PI / 180) * 45}%`,
                top: `${50 + Math.sin((i * 30 + progress * 3.6) * Math.PI / 180) * 45}%`,
              }}
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="text-center mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              {currentStep.message}
            </h4>
            
            {/* Analysis Steps List */}
            <div className="max-w-md mx-auto space-y-3">
              {analysisSteps.slice(0, -1).map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    index < currentStepIndex 
                      ? 'bg-green-50 text-green-800' 
                      : index === currentStepIndex
                      ? 'bg-purple-50 text-purple-800'
                      : 'bg-gray-50 text-gray-500'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < currentStepIndex 
                      ? 'bg-green-500 text-white' 
                      : index === currentStepIndex
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < currentStepIndex ? '✓' : index + 1}
                  </div>
                  <span className="text-sm font-medium">
                    {step.message.replace('...', '')}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Analysis Details */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
          🧬 {t('analysisProfile.title')}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">{t('analysisProfile.fields.skinTone')}:</span>
            <span className="font-semibold ml-2 capitalize">{questionnaireData.skinTone}</span>
          </div>
          <div>
            <span className="text-gray-600">{t('analysisProfile.fields.lifestyle')}:</span>
            <span className="font-semibold ml-2 capitalize">{questionnaireData.lifestyle}</span>
          </div>
          <div>
            <span className="text-gray-600">{t('analysisProfile.fields.maintenance')}:</span>
            <span className="font-semibold ml-2 capitalize">{questionnaireData.maintenance}</span>
          </div>
          <div>
            <span className="text-gray-600">{t('analysisProfile.fields.currentColor')}:</span>
            <span className="font-semibold ml-2 capitalize">{questionnaireData.currentHairColor}</span>
          </div>
          <div>
            <span className="text-gray-600">{t('analysisProfile.fields.desiredVibe')}:</span>
            <span className="font-semibold ml-2 capitalize">{questionnaireData.desiredVibe}</span>
          </div>
          <div>
            <span className="text-gray-600">{t('analysisProfile.fields.experience')}:</span>
            <span className="font-semibold ml-2 capitalize">{questionnaireData.experience.replace('-', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Advanced Completion Celebration */}
      {analysisComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="text-center relative"
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          {/* Success Particle Explosion */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  backgroundColor: `hsl(${(i * 18) % 360}, 70%, 60%)`
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: [0, (Math.cos(i * 18 * Math.PI / 180) * 150)],
                  y: [0, (Math.sin(i * 18 * Math.PI / 180) * 150)],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  delay: i * 0.05
                }}
              />
            ))}
          </motion.div>
          
          {/* Main Completion Icon */}
          <motion.div
            className="text-8xl mb-6 relative z-10"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 360],
            }}
            transition={{ 
              scale: { duration: 1, repeat: 2 },
              rotate: { duration: 1.5 }
            }}
          >
            ✨
          </motion.div>
          
          {/* Success Message */}
          <motion.h4 
            className="text-3xl font-bold mb-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.span
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              {t('completionMessage')}
            </motion.span>
          </motion.h4>
          
          {/* Success Rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-green-400/30 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2 + i * 0.5],
                opacity: [0.6, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AIProcessing;