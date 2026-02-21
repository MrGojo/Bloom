import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Calendar, Heart, Sparkles } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { StatsCard } from '../components/StatsCard';
import { WaterTracker } from '../components/WaterTracker';
import { MoodSelector } from '../components/MoodSelector';
import { BoyfriendMessage } from '../components/BoyfriendMessage';
import { getDailyLog, updateDailyLog, getPeriodPrediction } from '../utils/api';
import { getTodayString, formatDisplayDate } from '../utils/dateHelpers';
import { getFromLocal } from '../utils/offline';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const [todayLog, setTodayLog] = useState(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const [mood, setMood] = useState('');
  const [streak, setStreak] = useState(0);
  const [nextPeriod, setNextPeriod] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = getTodayString();
  
  useEffect(() => {
    const isLoggedIn = getFromLocal('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    fetchTodayData();
  }, [navigate]);
  
  const fetchTodayData = async () => {
    try {
      const log = await getDailyLog(today);
      if (log) {
        setTodayLog(log);
        setWaterIntake(log.water_intake || 0);
        setMood(log.mood || '');
      }
      
      // Fetch period prediction
      try {
        const prediction = await getPeriodPrediction();
        setNextPeriod(prediction);
      } catch (error) {
        console.log('No period data yet');
      }
      
      // Calculate streak (simplified - count consecutive days with exercise)
      setStreak(5); // Placeholder
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleWaterUpdate = async (newIntake) => {
    setWaterIntake(newIntake);
    await saveDailyLog({ water_intake: newIntake });
  };
  
  const handleMoodSelect = async (selectedMood) => {
    setMood(selectedMood);
    await saveDailyLog({ mood: selectedMood });
    toast.success('Mood logged! 💜');
  };
  
  const saveDailyLog = async (updates) => {
    try {
      const logData = {
        ...todayLog,
        date: today,
        water_intake: waterIntake,
        mood: mood,
        ...updates
      };
      await updateDailyLog(today, logData);
    } catch (error) {
      console.error('Error saving log:', error);
    }
  };
  
  const calculateProgress = () => {
    if (!todayLog) return 0;
    const habits = [
      todayLog.movement_walk,
      todayLog.movement_yoga,
      todayLog.food_protein_breakfast,
      todayLog.food_vegetables,
      todayLog.food_avoided_junk,
      todayLog.hormone_sleep
    ];
    const completed = habits.filter(Boolean).length;
    return Math.round((completed / habits.length) * 100);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-pcos-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pcos-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pcos-text font-body">Loading your wellness data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div data-testid="dashboard" className="min-h-screen bg-pcos-background pb-24">
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-pcos-text">
                Hello, Grishu! 💕
              </h1>
              <p className="text-pcos-text-muted font-body">
                {formatDisplayDate(today)}
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-8 h-8 text-pcos-primary" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Boyfriend Message */}
        <BoyfriendMessage />
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <StatsCard
            data-testid="progress-card"
            icon={Sparkles}
            label="Today's Progress"
            value={calculateProgress()}
            unit="%"
            color="pcos-primary"
          />
          <StatsCard
            data-testid="streak-card"
            icon={Flame}
            label="Streak"
            value={streak}
            unit="days"
            color="pcos-secondary"
          />
        </motion.div>
        
        {/* Next Period Card */}
        {nextPeriod && nextPeriod.next_period && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/period-tracker')}
            className="bg-white rounded-pcos-xl p-6 shadow-pcos-card cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-pcos-text">Next Period</h3>
                  <p className="text-sm text-pcos-text-muted font-body">
                    Expected: {formatDisplayDate(nextPeriod.next_period)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-heading font-bold text-pcos-primary">
                  {nextPeriod.days_since_last_period}
                </div>
                <div className="text-xs text-pcos-text-muted font-body">days</div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Water Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WaterTracker 
            intake={waterIntake}
            onUpdate={handleWaterUpdate}
            goal={3}
          />
        </motion.div>
        
        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-pcos-xl p-6 shadow-pcos-card"
        >
          <MoodSelector selected={mood} onSelect={handleMoodSelect} />
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <motion.button
            data-testid="daily-habits-button"
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/daily-habits')}
            className="bg-gradient-to-br from-pcos-primary to-pcos-secondary rounded-pcos p-6 text-left shadow-pcos-button hover:opacity-90 transition-opacity"
          >
            <Heart className="w-8 h-8 text-white mb-3" />
            <h3 className="font-heading font-bold text-white text-lg">Daily Habits</h3>
            <p className="text-white/80 text-sm font-body">Track your routine</p>
          </motion.button>
          
          <motion.button
            data-testid="craving-button"
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/craving-emergency')}
            className="bg-white border-2 border-pcos-primary rounded-pcos p-6 text-left shadow-pcos-card hover:border-pcos-secondary transition-colors"
          >
            <div className="text-3xl mb-3">🍫</div>
            <h3 className="font-heading font-bold text-pcos-text text-lg">Craving Help</h3>
            <p className="text-pcos-text-muted text-sm font-body">Find alternatives</p>
          </motion.button>
        </motion.div>
      </div>
      
      <BottomNav />
    </div>
  );
}