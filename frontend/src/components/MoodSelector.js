import React from 'react';
import { motion } from 'framer-motion';

const moods = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😞', label: 'Sad', value: 'sad' },
  { emoji: '😩', label: 'Anxious', value: 'anxious' },
  { emoji: '😤', label: 'Angry', value: 'angry' },
];

export const MoodSelector = ({ selected, onSelect }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-body font-medium text-pcos-text">How are you feeling today?</label>
      <div className="grid grid-cols-3 gap-3">
        {moods.map((mood) => {
          const isSelected = selected === mood.value;
          return (
            <motion.button
              key={mood.value}
              data-testid={`mood-${mood.value}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(mood.value)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                isSelected 
                  ? 'border-pcos-primary bg-gradient-to-br from-pcos-primary/10 to-pcos-secondary/10 shadow-pcos-button' 
                  : 'border-pcos-border bg-white hover:border-pcos-primary/50'
              }`}
            >
              <div className="text-3xl mb-1">{mood.emoji}</div>
              <div className={`text-xs font-body ${
                isSelected ? 'text-pcos-text font-medium' : 'text-pcos-text-muted'
              }`}>
                {mood.label}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};