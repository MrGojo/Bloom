import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Clock, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { getRandomCraving } from '../utils/api';
import { toast } from 'sonner';

export default function CravingEmergency() {
  const navigate = useNavigate();
  const [craving, setCraving] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const handleGetAlternative = async () => {
    setLoading(true);
    try {
      const data = await getRandomCraving();
      setCraving(data);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      toast.success('Found a healthy swap! 🌿');
    } catch (error) {
      toast.error('Failed to get alternative');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div data-testid="craving-emergency-page" className="min-h-screen bg-pcos-background pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-pcos-background/95 backdrop-blur-lg border-b border-pcos-border p-6">
          <div className="flex items-center justify-between">
            <button
              data-testid="back-button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-pcos-card"
            >
              <ArrowLeft className="w-5 h-5 text-pcos-text" />
            </button>
            <h1 className="text-2xl font-heading font-bold text-pcos-text">Craving Emergency</h1>
            <div className="w-10"></div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-pink-100 via-purple-100 to-pink-100 rounded-pcos-xl p-8 text-center space-y-4 relative overflow-hidden"
          >
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, x: Math.random() * 100 + '%', opacity: 1 }}
                    animate={{ y: 400, opacity: 0 }}
                    transition={{ duration: 2, delay: Math.random() * 0.5 }}
                    className="absolute text-2xl"
                  >
                    {['✨', '🌿', '💜', '🌱'][Math.floor(Math.random() * 4)]}
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="text-6xl mb-2">🍫➡️🥗</div>
            <h2 className="text-2xl font-heading font-bold text-pcos-text">
              Having a craving?
            </h2>
            <p className="text-pcos-text-muted font-body">
              No judgment! Let's find you a healthier alternative that still hits the spot 💕
            </p>
          </motion.div>
          
          {/* Emergency Button */}
          <motion.button
            data-testid="get-alternative-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGetAlternative}
            disabled={loading}
            className="w-full py-6 rounded-pcos bg-gradient-to-r from-pcos-primary to-pcos-secondary text-white font-heading font-bold text-xl shadow-pcos-button hover:opacity-90 transition-opacity disabled:opacity-50 relative overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Finding alternatives...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">🍫</span>
                <span>Get Healthy Swap</span>
              </div>
            )}
          </motion.button>
          
          {/* Alternative Card */}
          <AnimatePresence mode="wait">
            {craving && (
              <motion.div
                key={craving.craving_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-pcos-xl p-6 shadow-pcos-card space-y-4"
              >
                {/* Instead of / Swap to */}
                <div className="space-y-3">
                  <div className="p-4 bg-red-50 rounded-2xl">
                    <div className="text-xs font-body font-medium text-red-600 mb-1">Instead of:</div>
                    <div className="text-lg font-heading font-bold text-red-700 flex items-center gap-2">
                      <span className="text-2xl">❌</span>
                      {craving.junk_food}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl">⬇️</div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <div className="text-xs font-body font-medium text-green-600 mb-1">Try this:</div>
                    <div className="text-lg font-heading font-bold text-green-700 flex items-center gap-2">
                      <span className="text-2xl">✅</span>
                      {craving.healthy_alternative}
                    </div>
                  </div>
                </div>
                
                {/* Details */}
                <div className="pt-4 border-t border-pcos-border space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pcos-primary" />
                    <span className="text-sm font-body text-pcos-text">
                      Prep time: <span className="font-medium">{craving.prep_time}</span>
                    </span>
                  </div>
                  
                  {craving.ready_made && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-pcos-success/20 rounded-full">
                      <ChefHat className="w-4 h-4 text-green-700" />
                      <span className="text-xs font-body font-medium text-green-700">Ready-made option available!</span>
                    </div>
                  )}
                  
                  {/* Ingredients */}
                  {craving.ingredients && craving.ingredients.length > 0 && (
                    <div>
                      <h4 className="text-sm font-body font-medium text-pcos-text mb-2">Ingredients:</h4>
                      <div className="flex flex-wrap gap-2">
                        {craving.ingredients.map((ingredient, i) => (
                          <span key={i} className="px-3 py-1 bg-pcos-secondary/30 rounded-full text-xs font-body text-pcos-text">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Recipe Steps */}
                  {craving.recipe_steps && craving.recipe_steps.length > 0 && (
                    <div>
                      <h4 className="text-sm font-body font-medium text-pcos-text mb-2">Quick Steps:</h4>
                      <ol className="space-y-2">
                        {craving.recipe_steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm font-body text-pcos-text-muted">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pcos-primary text-white flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <span className="flex-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
                
                {/* Try Another Button */}
                <button
                  data-testid="try-another-button"
                  onClick={handleGetAlternative}
                  className="w-full py-3 rounded-full border-2 border-pcos-primary text-pcos-primary font-body font-medium hover:bg-pcos-primary hover:text-white transition-all"
                >
                  Try Another Alternative
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Support Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-pcos-primary to-pcos-secondary rounded-pcos-xl p-6 text-center"
          >
            <p className="text-white font-body leading-relaxed">
              Remember: It's okay to have cravings! Making small, healthier swaps is what matters. You're doing amazing 💜
            </p>
          </motion.div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}