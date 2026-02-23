import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '../utils/api';
import { saveToLocal, getFromLocal } from '../utils/offline';
import { toast } from 'sonner';

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const navigate = useNavigate();

  // ✅ AUTO LOGIN ON REOPEN
  useEffect(() => {
    const isLoggedIn = getFromLocal('isLoggedIn');
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

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

        // 💕 Trigger heart burst
        setShowHearts(true);

        // Delay dashboard navigation slightly
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (error) {
      toast.error('Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pcos-background via-pcos-secondary/20 to-pcos-background flex items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-pcos-border bg-white focus:border-pcos-primary focus:outline-none transition-colors font-body text-pcos-text"
                />

                {/* 👁 Pulse Toggle */}
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileTap={{ scale: 0.85 }}
                  animate={{
                    scale: showPassword ? [1, 1.25, 1] : [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut"
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 
                             text-pcos-text-muted hover:text-pcos-primary 
                             transition-colors 
                             hover:drop-shadow-[0_0_6px_rgba(236,72,153,0.6)]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>

            <motion.button
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
              Password: <span className="font-medium text-pcos-text">grishmasingh</span>
            </p>
          </div>
        </motion.div>

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

      {/* 💕 HEART BURST */}
      {showHearts && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, scale: 0, y: 0, x: 0 }}
              animate={{
                opacity: 0,
                scale: 1.2,
                y: -120 - Math.random() * 60,
                x: (Math.random() - 0.5) * 200
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut"
              }}
              className="absolute"
            >
              <Heart className="w-6 h-6 text-pcos-primary fill-pcos-primary" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}