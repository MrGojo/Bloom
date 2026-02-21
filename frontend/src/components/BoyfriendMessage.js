import React, { useEffect, useState } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDailyMessage } from '../utils/api';

export const BoyfriendMessage = () => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchMessage();
  }, []);
  
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
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessage();
    setTimeout(() => setRefreshing(false), 500);
  };
  
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-white fill-white" />
            <span className="text-sm font-body font-medium text-white">Message from your boyfriend</span>
          </div>
          {/* New Message Button */}
          <motion.button
            data-testid="refresh-message-button"
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all disabled:opacity-50"
            title="Get new message"
          >
            <RefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
        <motion.p
          key={message?.message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-heading font-semibold text-white leading-relaxed"
        >
          {message?.message || 'You are healing, my love 💕'}
        </motion.p>
      </div>
    </motion.div>
  );
};