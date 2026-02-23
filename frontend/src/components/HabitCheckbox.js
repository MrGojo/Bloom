import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const HabitCheckbox = ({ label, checked, onChange, icon: Icon }) => {
  return (
    <motion.label
      data-testid={`habit-${label.toLowerCase().replace(/\s+/g, '-')}`}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-pcos-border hover:border-pcos-primary/50 cursor-pointer transition-all"
    >
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="absolute inset-0 w-6 h-6 opacity-0 cursor-pointer z-10"
        />
        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all pointer-events-none ${
          checked 
            ? 'bg-gradient-to-br from-pcos-primary to-pcos-secondary border-pcos-primary' 
            : 'border-pcos-border bg-white'
        }`}>
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex items-center gap-3">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            checked ? 'bg-pcos-primary/10' : 'bg-pcos-secondary/30'
          }`}>
            <Icon className={`w-5 h-5 ${
              checked ? 'text-pcos-primary' : 'text-pcos-text-muted'
            }`} />
          </div>
        )}
        <span className={`font-body ${
          checked ? 'text-pcos-text font-medium' : 'text-pcos-text-muted'
        }`}>
          {label}
        </span>
      </div>
    </motion.label>
  );
};