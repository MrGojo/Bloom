import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDailyMessage } from '../utils/api';

export const BoyfriendMessage = () => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await getDailyMessage();
        setMessage(data);
      } catch (error) {
        console.error('Error fetching message:', error);
        setMessage({ message: 'You are healing, my love 💕' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessage();
  }, []);
  
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-pcos-primary to-pcos-secondary rounded-pcos-xl p-6 animate-pulse">
        <div className="h-6 bg-white/30 rounded w-3/4"></div>
      </div>
    );
  }
  
  return (
    <motion.div
      data-testid="boyfriend-message"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-pcos-primary to-pcos-secondary rounded-pcos-xl p-6 shadow-pcos-card relative overflow-hidden"
    >
      {/* Decorative hearts */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-2 right-2"
      >
        <Heart className="w-8 h-8 text-white/20 fill-white/20" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-4 left-4"
      >
        <Heart className="w-6 h-6 text-white/20 fill-white/20" />
      </motion.div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-white fill-white" />
          <span className="text-sm font-body font-medium text-white">Message from your boyfriend</span>
        </div>
        <p className="text-lg font-heading font-semibold text-white leading-relaxed">
          {message?.message || 'You are healing, my love 💕'}
        </p>
      </div>
    </motion.div>
  );
};