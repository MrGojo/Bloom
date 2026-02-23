import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Heart, Apple, FileText, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/period-tracker', icon: Calendar, label: 'Period' },
    { path: '/craving-emergency', icon: Heart, label: 'Cravings' },
    { path: '/food-suggestions', icon: Apple, label: 'Food' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];
  
  return (
    <nav 
      data-testid="bottom-navigation"
      className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-pcos-border pb-safe pt-2 px-4 flex justify-around items-center z-50 rounded-t-pcos-xl shadow-pcos-card"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            data-testid={`nav-${item.label.toLowerCase()}`}
            className="flex flex-col items-center gap-1 relative"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-2xl transition-all ${
                isActive ? 'bg-gradient-to-r from-pcos-primary to-pcos-secondary' : ''
              }`}
            >
              <Icon 
                className={`w-6 h-6 ${
                  isActive ? 'text-white' : 'text-pcos-text-muted'
                }`}
              />
            </motion.div>
            <span 
              className={`text-xs font-body ${
                isActive ? 'text-pcos-text font-medium' : 'text-pcos-text-muted'
              }`}
            >
              {item.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 w-1 h-1 bg-pcos-primary rounded-full"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};