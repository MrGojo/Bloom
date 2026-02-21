import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Lock } from 'lucide-react';
import { login } from '../utils/api';
import { saveToLocal } from '../utils/offline';
import { toast } from 'sonner';

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await login(password);
      if (response.success) {
        saveToLocal('isLoggedIn', true);
        saveToLocal('userId', response.user_id);
        saveToLocal('userType', response.user_type);
        saveToLocal('userName', response.user_name);
        toast.success(response.message);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pcos-background via-pcos-secondary/20 to-pcos-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-pcos-primary to-pcos-secondary rounded-full flex items-center justify-center shadow-pcos-button">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-heading font-bold text-pcos-text mb-2">
            Welcome Back
          </h1>
          <p className="text-pcos-text-muted font-body">
            Your wellness journey awaits 💕
          </p>
        </div>
        
        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-pcos-xl p-8 shadow-pcos-card"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-body font-medium text-pcos-text mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pcos-text-muted" />
                <input
                  data-testid="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-pcos-border bg-white focus:border-pcos-primary focus:outline-none transition-colors font-body text-pcos-text"
                />
              </div>
            </div>
            
            <motion.button
              data-testid="login-submit-button"
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-pcos-primary to-pcos-secondary text-white font-heading font-bold text-lg shadow-pcos-button hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Enter'}
            </motion.button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-pcos-text-muted font-body">
              Hint: Password is <span className="font-medium text-pcos-text">grishu2025</span>
            </p>
          </div>
        </motion.div>
        
        {/* Footer message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-pcos-text font-body italic">
            "For My Strong Baby Grishu 💕 Healing together."
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}