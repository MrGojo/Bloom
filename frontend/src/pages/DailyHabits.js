import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Walk, Sunrise, Leaf, Egg, Salad, Droplets, Ban, Moon, Coffee, Heart } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { HabitCheckbox } from '../components/HabitCheckbox';
import { getDailyLog, updateDailyLog } from '../utils/api';
import { getTodayString } from '../utils/dateHelpers';
import { toast } from 'sonner';

export default function DailyHabits() {
  const navigate = useNavigate();
  const today = getTodayString();
  const [habits, setHabits] = useState({
    movement_walk: false,
    movement_yoga: false,
    movement_sunlight: false,
    food_protein_breakfast: false,
    food_vegetables: false,
    food_water: false,
    food_avoided_junk: false,
    hormone_sleep: false,
    hormone_no_late_snack: false,
    hormone_stress_care: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchTodayHabits();
  }, []);
  
  const fetchTodayHabits = async () => {
    try {
      const log = await getDailyLog(today);
      if (log) {
        setHabits({
          movement_walk: log.movement_walk || false,
          movement_yoga: log.movement_yoga || false,
          movement_sunlight: log.movement_sunlight || false,
          food_protein_breakfast: log.food_protein_breakfast || false,
          food_vegetables: log.food_vegetables || false,
          food_water: log.food_water || false,
          food_avoided_junk: log.food_avoided_junk || false,
          hormone_sleep: log.hormone_sleep || false,
          hormone_no_late_snack: log.hormone_no_late_snack || false,
          hormone_stress_care: log.hormone_stress_care || false,
        });
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleHabitChange = (habitKey, value) => {
    setHabits(prev => ({ ...prev, [habitKey]: value }));
  };
  
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDailyLog(today, {
        date: today,
        ...habits
      });
      toast.success('Habits saved! Keep going 💜');
    } catch (error) {
      toast.error('Failed to save habits');
    } finally {
      setSaving(false);
    }
  };
  
  const calculateCompletion = () => {
    const total = Object.keys(habits).length;
    const completed = Object.values(habits).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-pcos-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pcos-primary border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div data-testid="daily-habits-page" className="min-h-screen bg-pcos-background pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-pcos-background/95 backdrop-blur-lg border-b border-pcos-border p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              data-testid="back-button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-pcos-card"
            >
              <ArrowLeft className="w-5 h-5 text-pcos-text" />
            </button>
            <h1 className="text-2xl font-heading font-bold text-pcos-text">Daily Habits</h1>
            <motion.button
              data-testid="save-habits-button"
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pcos-primary to-pcos-secondary text-white font-body font-medium shadow-pcos-button disabled:opacity-50"
            >
              {saving ? 'Saving...' : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </div>
              )}
            </motion.button>
          </div>
          
          {/* Progress */}
          <div className="bg-white rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-body text-pcos-text-muted">Today's Progress</span>
              <span className="text-lg font-heading font-bold text-pcos-primary">{calculateCompletion()}%</span>
            </div>
            <div className="h-2 bg-pcos-secondary/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calculateCompletion()}%` }}
                className="h-full bg-gradient-to-r from-pcos-primary to-pcos-secondary rounded-full"
              />
            </div>
          </div>
        </div>
        
        {/* Habits List */}
        <div className="p-6 space-y-6">
          {/* Movement Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-pcos-text flex items-center gap-2">
              <Walk className="w-5 h-5 text-pcos-primary" />
              Movement
            </h2>
            <div className="space-y-2">
              <HabitCheckbox
                label="20-30 min walk"
                checked={habits.movement_walk}
                onChange={(val) => handleHabitChange('movement_walk', val)}
                icon={Walk}
              />
              <HabitCheckbox
                label="5-10 min yoga"
                checked={habits.movement_yoga}
                onChange={(val) => handleHabitChange('movement_yoga', val)}
                icon={Leaf}
              />
              <HabitCheckbox
                label="Sunlight exposure"
                checked={habits.movement_sunlight}
                onChange={(val) => handleHabitChange('movement_sunlight', val)}
                icon={Sunrise}
              />
            </div>
          </div>
          
          {/* Food Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-pcos-text flex items-center gap-2">
              <Salad className="w-5 h-5 text-pcos-primary" />
              Food
            </h2>
            <div className="space-y-2">
              <HabitCheckbox
                label="Protein breakfast"
                checked={habits.food_protein_breakfast}
                onChange={(val) => handleHabitChange('food_protein_breakfast', val)}
                icon={Egg}
              />
              <HabitCheckbox
                label="Ate vegetables"
                checked={habits.food_vegetables}
                onChange={(val) => handleHabitChange('food_vegetables', val)}
                icon={Salad}
              />
              <HabitCheckbox
                label="2-3L water"
                checked={habits.food_water}
                onChange={(val) => handleHabitChange('food_water', val)}
                icon={Droplets}
              />
              <HabitCheckbox
                label="Avoided junk food"
                checked={habits.food_avoided_junk}
                onChange={(val) => handleHabitChange('food_avoided_junk', val)}
                icon={Ban}
              />
            </div>
          </div>
          
          {/* Hormone Care Section */}
          <div className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-pcos-text flex items-center gap-2">
              <Heart className="w-5 h-5 text-pcos-primary" />
              Hormone Care
            </h2>
            <div className="space-y-2">
              <HabitCheckbox
                label="7+ hours sleep"
                checked={habits.hormone_sleep}
                onChange={(val) => handleHabitChange('hormone_sleep', val)}
                icon={Moon}
              />
              <HabitCheckbox
                label="No late-night snacking"
                checked={habits.hormone_no_late_snack}
                onChange={(val) => handleHabitChange('hormone_no_late_snack', val)}
                icon={Coffee}
              />
              <HabitCheckbox
                label="Stress management"
                checked={habits.hormone_stress_care}
                onChange={(val) => handleHabitChange('hormone_stress_care', val)}
                icon={Leaf}
              />
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}