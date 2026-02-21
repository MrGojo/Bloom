import React from 'react';
import { motion } from 'framer-motion';

export const StatsCard = ({ icon: Icon, label, value, unit, color = 'pcos-primary', onClick }) => {
  return (
    <motion.div
      data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-pcos-xl p-6 shadow-pcos-card cursor-pointer ${
        onClick ? 'hover:shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-body text-pcos-text-muted mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 
              className="text-3xl font-heading font-bold"
              style={{ color: `var(--tw-colors-${color})` }}
            >
              {value}
            </h3>
            {unit && <span className="text-sm text-pcos-text-muted font-body">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${color === 'pcos-primary' ? '#D8B4F8' : '#E5D4FF'}, ${color === 'pcos-primary' ? '#C4B5FD' : '#F3E8FF'})` 
            }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
};