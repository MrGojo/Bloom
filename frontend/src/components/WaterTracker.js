import React from 'react';
import { Droplets, Plus, Minus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const WaterTracker = ({ intake, onUpdate, goal = 3 }) => {
  const percentage = Math.min((intake / goal) * 100, 100);
  const glasses = Math.floor(intake * 4); // 1L = ~4 glasses
  
  const increment = () => {
    if (intake < goal + 1) {
      onUpdate(Math.round((intake + 0.25) * 100) / 100);
    }
  };
  
  const decrement = () => {
    if (intake > 0) {
      onUpdate(Math.round((intake - 0.25) * 100) / 100);
    }
  };
  
  return (
    <div data-testid="water-tracker" className="bg-white rounded-pcos-xl p-6 shadow-pcos-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-pcos-text">Water Intake</h3>
            <p className="text-sm text-pcos-text-muted font-body">Stay hydrated!</p>
          </div>
        </div>
        {percentage >= 100 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-pcos-success flex items-center justify-center"
          >
            <Check className="w-5 h-5 text-green-700" />
          </motion.div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm font-body text-pcos-text-muted mb-2">
          <span>{intake}L / {goal}L</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="h-3 bg-pcos-secondary/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
          />
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            data-testid="water-decrement"
            whileTap={{ scale: 0.9 }}
            onClick={decrement}
            disabled={intake <= 0}
            className="w-10 h-10 rounded-full bg-pcos-secondary hover:bg-pcos-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Minus className="w-5 h-5 text-pcos-text" />
          </motion.button>
          
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-pcos-text" data-testid="water-amount">
              {intake}L
            </div>
            <div className="text-xs text-pcos-text-muted font-body">
              ~{glasses} glasses
            </div>
          </div>
          
          <motion.button
            data-testid="water-increment"
            whileTap={{ scale: 0.9 }}
            onClick={increment}
            disabled={intake >= goal + 1}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-pcos-primary to-pcos-secondary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-white" />
          </motion.button>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-pcos-text-muted font-body">Goal</div>
          <div className="text-sm font-body font-medium text-pcos-text">{goal}L/day</div>
        </div>
      </div>
    </div>
  );
};