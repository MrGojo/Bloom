import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, ChefHat, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { getCravings } from '../utils/api';
import { toast } from 'sonner';

export default function CravingEmergency() {
  const navigate = useNavigate();
  const [allCravings, setAllCravings] = useState([]);
  const [selectedCraving, setSelectedCraving] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    fetchCravings();
  }, []);
  
  const fetchCravings = async () => {
    try {
      const data = await getCravings();
      setAllCravings(data || []);
    } catch (error) {
      console.error('Error fetching cravings:', error);
      toast.error('Failed to load cravings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectCraving = (craving) => {
    setSelectedCraving(craving);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    toast.success('Found a healthy swap! 🌿');
  };
  
  const filteredCravings = allCravings.filter(c => 
    c.junk_food.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="min-h-screen bg-pcos-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pcos-primary border-t-transparent"></div>
      </div>
    );
  }
  
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
              What are you craving?
            </h2>
            <p className="text-pcos-text-muted font-body leading-relaxed">
              No judgment! Tell me what you're craving and I'll find you a healthier alternative that still hits the spot 💕
            </p>
          </motion.div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pcos-text-muted" />
            <input
              data-testid="search-cravings-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your craving..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-pcos-border bg-white focus:border-pcos-primary outline-none font-body text-pcos-text"
            />
          </div>
          
          {/* Cravings Grid */}
          {!selectedCraving ? (
            <div className="space-y-3">
              <h3 className="text-lg font-heading font-bold text-pcos-text px-2">Select your craving:</h3>
              <div className="grid grid-cols-2 gap-3">
                {filteredCravings.map((craving) => (
                  <motion.button
                    key={craving.craving_id}
                    data-testid={`craving-option-${craving.junk_food.toLowerCase().replace(/\s+/g, '-')}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectCraving(craving)}
                    className="bg-white rounded-2xl p-5 shadow-pcos-card hover:shadow-lg transition-all text-left border-2 border-pcos-border hover:border-pcos-primary"
                  >
                    <div className="text-3xl mb-2">🍽️</div>
                    <h4 className="font-heading font-bold text-pcos-text mb-1">{craving.junk_food}</h4>
                    <p className="text-xs text-pcos-text-muted font-body">Tap for alternative</p>
                  </motion.button>
                ))}
              </div>
              
              {filteredCravings.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-pcos-text-muted font-body">
                    No cravings found. Try a different search!
                  </p>
                </div>
              )}
            </div>
          ) : (
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