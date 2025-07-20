'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const TrustSection = () => {
  const t = useTranslations('trustSection');
  const tMain = useTranslations('mainPage');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const benefitsData = [
    { icon: "✅", text: t('benefits.0.text') },
    { icon: "⏰", text: t('benefits.1.text') },
    { icon: "🏠", text: t('benefits.2.text') },
    { icon: "💯", text: t('benefits.3.text') }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-6 tracking-tight"
            style={{
              textShadow: '0 2px 20px rgba(0,0,0,0.1)'
            }}
          >
            {t('title')}
          </motion.h2>
          
          {/* Decorative Line */}
          <motion.div 
            className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10"
        >
          {benefitsData.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div
                className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-white/50 overflow-hidden"
                variants={{
                  hover: {
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                  },
                  tap: {
                    scale: 0.98
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
                {/* Background Gradient Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-cyan-400/10 opacity-0"
                  variants={{
                    hover: { opacity: 1, scale: 1.1 }
                  }}
                  transition={{ duration: 0.4 }}
                />
                
                {/* Icon */}
                <motion.div 
                  className="text-4xl sm:text-5xl mb-4 sm:mb-6"
                  variants={{
                    hover: { 
                      scale: 1.2,
                      rotateY: 15,
                      rotateX: 10 
                    }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {benefit.icon}
                </motion.div>
                
                {/* Text */}
                <motion.p 
                  className="text-base sm:text-lg text-gray-700 font-medium leading-relaxed relative z-10"
                  variants={{
                    hover: { 
                      y: -2,
                      color: "#374151"
                    }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {benefit.text}
                </motion.p>
                
                {/* Accent Line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  variants={{
                    hover: { width: "100%" }
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: "30%" }}
                  transition={{ 
                    width: { duration: 0.4 },
                    delay: index * 0.1 + 0.5 
                  }}
                />
                
                {/* Floating Particles */}
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
                      className="absolute w-1 h-1 bg-purple-400 rounded-full"
                      style={{
                        left: `${20 + i * 25}%`,
                        top: `${20 + Math.sin(i) * 20}%`,
                      }}
                      variants={{
                        hover: {
                          scale: [0, 1.5, 0],
                          opacity: [0, 0.8, 0],
                          y: [0, -15]
                        }
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="relative group mt-12 sm:mt-16"
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
              const message = encodeURIComponent(tMain('whatsapp.generalBooking'));
              if (typeof window !== 'undefined') {
                window.open(`https://wa.me/${tMain('sections.contact.whatsappNumber')}?text=${message}`, '_blank');
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
            
            {/* Sparkle Effects */}
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
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${20 + (i * 10)}%`,
                    left: `${15 + (i * 12)}%`,
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
                    delay: i * 0.1,
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
              {t('cta.bookNow')}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;