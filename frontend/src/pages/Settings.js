import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Download, LogOut, Heart, Mail, Smartphone, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { removeFromLocal, subscribeToPushNotifications, setupInstallPrompt, showInstallPrompt } from '../utils/offline';
import { sendDailyReminder } from '../utils/api';
import { toast } from 'sonner';

export default function Settings() {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  
  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
    
    // Setup install prompt
    setupInstallPrompt((canShow) => {
      setCanInstall(canShow);
    });
  }, []);
  
  const handleLogout = () => {
    removeFromLocal('isLoggedIn');
    removeFromLocal('userId');
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        await subscribeToPushNotifications();
        toast.success('Notifications enabled! 🔔');
      } else {
        toast.error('Notification permission denied');
      }
    }
  };
  
  const handleTestReminder = async () => {
    try {
      await sendDailyReminder();
      toast.success('Test reminder sent to email!');
    } catch (error) {
      toast.error('Failed to send reminder');
    }
  };
  
  const handleInstallApp = async () => {
    const installed = await showInstallPrompt();
    if (installed) {
      toast.success('App installed! 🎉');
      setCanInstall(false);
    }
  };
  
  const SettingCard = ({ icon: Icon, title, description, action, actionText, variant = 'default' }) => (
    <div className="bg-white rounded-2xl p-5 shadow-pcos-card">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          variant === 'danger' ? 'bg-red-100' : 'bg-gradient-to-br from-pcos-primary to-pcos-secondary'
        }`}>
          <Icon className={`w-6 h-6 ${variant === 'danger' ? 'text-red-600' : 'text-white'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-lg text-pcos-text mb-1">{title}</h3>
          <p className="text-sm text-pcos-text-muted font-body mb-3">{description}</p>
          {action && (
            <button
              onClick={action}
              className={`px-4 py-2 rounded-full font-body font-medium text-sm transition-all ${
                variant === 'danger'
                  ? 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white'
                  : 'bg-pcos-secondary hover:bg-pcos-primary text-pcos-text hover:text-white'
              }`}
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div data-testid="settings-page" className="min-h-screen bg-pcos-background pb-24">
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
            <h1 className="text-2xl font-heading font-bold text-pcos-text">Settings</h1>
            <div className="w-10"></div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="bg-gradient-to-r from-pcos-primary to-pcos-secondary rounded-pcos-xl p-6 text-center text-white">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
            <h2 className="text-2xl font-heading font-bold mb-1">Grishu</h2>
            <p className="text-white/80 font-body text-sm">Your wellness journey 💕</p>
          </div>
          
          {/* App Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-bold text-pcos-text px-2">App Features</h3>
            
            {canInstall && (
              <SettingCard
                icon={Smartphone}
                title="Install App"
                description="Install this app on your phone for easy access and offline support"
                action={handleInstallApp}
                actionText="Install Now"
              />
            )}
            
            <SettingCard
              icon={Bell}
              title="Push Notifications"
              description={notificationsEnabled ? 'Daily reminders are enabled' : 'Enable daily wellness reminders'}
              action={!notificationsEnabled ? handleEnableNotifications : null}
              actionText="Enable"
            />
            
            <SettingCard
              icon={Mail}
              title="Email Reminders"
              description="Receive daily wellness check-in reminders via email"
              action={handleTestReminder}
              actionText="Send Test Email"
            />
            
            <div 
              onClick={() => navigate('/monthly-report')}
              className="bg-white rounded-2xl p-5 shadow-pcos-card cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-pcos-text">Monthly Reports</h3>
                  <p className="text-sm text-pcos-text-muted font-body">View and download your wellness reports</p>
                </div>
              </div>
            </div>
            
            <div 
              onClick={() => navigate('/admin-panel')}
              className="bg-white rounded-2xl p-5 shadow-pcos-card cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-pcos-text">Boyfriend Panel</h3>
                  <p className="text-sm text-pcos-text-muted font-body">Manage daily love messages</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-bold text-pcos-text px-2">About</h3>
            
            <div className="bg-white rounded-2xl p-5 shadow-pcos-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-pcos-text mb-2">About This App</h3>
                  <p className="text-sm text-pcos-text-muted font-body leading-relaxed">
                    This is a private wellness companion designed with love for managing PCOS. 
                    Track your habits, cycles, and progress in a gentle, supportive way. 
                    Remember: healing is not linear, and you're doing amazing 💜
                  </p>
                  <p className="text-xs text-pcos-text-muted font-body mt-3">
                    Version 1.0 | Made with 💕
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logout */}
          <div className="pt-4">
            <SettingCard
              icon={LogOut}
              title="Logout"
              description="Sign out of your account"
              action={handleLogout}
              actionText="Logout"
              variant="danger"
            />
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}