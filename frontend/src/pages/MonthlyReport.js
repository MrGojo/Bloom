import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, TrendingUp, Droplets, Moon, Heart, Calendar, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { getMonthlyReports, generateMonthlyReport } from '../utils/api';
import { getMonthName } from '../utils/dateHelpers';
import { toast } from 'sonner';

export default function MonthlyReport() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    try {
      const data = await getMonthlyReports();
      setReports(data || []);
      if (data && data.length > 0) {
        setSelectedReport(data[0]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const now = new Date();
      const report = await generateMonthlyReport(now.getMonth() + 1, now.getFullYear());
      setReports([report, ...reports]);
      setSelectedReport(report);
      toast.success('Report generated! 🎉');
    } catch (error) {
      toast.error('Failed to generate report. Make sure you have logged data this month.');
    } finally {
      setGenerating(false);
    }
  };
  
  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl p-4 shadow-pcos-card">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm font-body text-pcos-text-muted">{label}</span>
      </div>
      <div className="text-2xl font-heading font-bold text-pcos-text">
        {value}
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="min-h-screen bg-pcos-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pcos-primary border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div data-testid="monthly-report-page" className="min-h-screen bg-pcos-background pb-24">
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
            <h1 className="text-2xl font-heading font-bold text-pcos-text">Monthly Glow Report</h1>
            <motion.button
              data-testid="generate-report-button"
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateReport}
              disabled={generating}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pcos-primary to-pcos-secondary text-white font-body font-medium text-sm shadow-pcos-button disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate'}
            </motion.button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-heading font-bold text-pcos-text mb-2">
                No reports yet
              </h3>
              <p className="text-pcos-text-muted font-body mb-6">
                Generate your first monthly report to see your progress!
              </p>
              <button
                onClick={handleGenerateReport}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pcos-primary to-pcos-secondary text-white font-body font-medium shadow-pcos-button"
              >
                Generate Report
              </button>
            </div>
          ) : (
            <>
              {/* Report Selector */}
              <div className="bg-white rounded-pcos-xl p-4 shadow-pcos-card">
                <label className="text-sm font-body font-medium text-pcos-text-muted mb-2 block">
                  Select Month
                </label>
                <select
                  data-testid="report-selector"
                  value={selectedReport?.report_id || ''}
                  onChange={(e) => {
                    const report = reports.find(r => r.report_id === e.target.value);
                    setSelectedReport(report);
                  }}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-pcos-border focus:border-pcos-primary outline-none font-body text-pcos-text"
                >
                  {reports.map(report => (
                    <option key={report.report_id} value={report.report_id}>
                      {getMonthName(parseInt(report.month))} {report.year}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedReport && (
                <motion.div
                  key={selectedReport.report_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Hero Card */}
                  <div className="bg-gradient-to-br from-pcos-primary via-pcos-secondary to-pcos-primary rounded-pcos-xl p-8 text-center text-white space-y-4">
                    <h2 className="text-3xl font-heading font-bold">
                      Grishu's Glow Report 💜
                    </h2>
                    <p className="text-lg font-body opacity-90">
                      {getMonthName(parseInt(selectedReport.month))} {selectedReport.year}
                    </p>
                    <div className="pt-4">
                      <div className="text-sm font-body opacity-80 mb-2">Hormone Balance Score</div>
                      <div className="text-5xl font-heading font-bold">
                        {selectedReport.hormone_balance_score}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard
                      icon={TrendingUp}
                      label="Exercise"
                      value={`${selectedReport.exercise_consistency}%`}
                      color="from-green-400 to-green-600"
                    />
                    <StatCard
                      icon={Droplets}
                      label="Water Avg"
                      value={`${selectedReport.water_average}L`}
                      color="from-blue-400 to-blue-600"
                    />
                    <StatCard
                      icon={Moon}
                      label="Sleep"
                      value={`${selectedReport.sleep_average}%`}
                      color="from-purple-400 to-purple-600"
                    />
                    <StatCard
                      icon={Heart}
                      label="Junk Avoided"
                      value={`${selectedReport.junk_avoided_count} days`}
                      color="from-pink-400 to-pink-600"
                    />
                  </div>
                  
                  {/* Streak Card */}
                  <div className="bg-white rounded-pcos-xl p-6 shadow-pcos-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg text-pcos-text">Longest Streak</h3>
                          <p className="text-sm text-pcos-text-muted font-body">Consecutive exercise days</p>
                        </div>
                      </div>
                      <div className="text-4xl font-heading font-bold text-pcos-primary">
                        {selectedReport.streak_record}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mood Trends */}
                  {selectedReport.mood_trends && Object.keys(selectedReport.mood_trends).length > 0 && (
                    <div className="bg-white rounded-pcos-xl p-6 shadow-pcos-card">
                      <h3 className="font-heading font-bold text-lg text-pcos-text mb-4 flex items-center gap-2">
                        <span>😊</span> Mood Trends
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(selectedReport.mood_trends)
                          .sort(([, a], [, b]) => b - a)
                          .map(([mood, count]) => (
                            <div key={mood} className="flex items-center gap-3">
                              <span className="capitalize font-body font-medium text-pcos-text w-20">{mood}</span>
                              <div className="flex-1 h-8 bg-pcos-secondary/20 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(count / Math.max(...Object.values(selectedReport.mood_trends))) * 100}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                  className="h-full bg-gradient-to-r from-pcos-primary to-pcos-secondary rounded-full flex items-center justify-end pr-3"
                                >
                                  <span className="text-white text-sm font-body font-bold">{count}</span>
                                </motion.div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Cycle Regularity */}
                  <div className="bg-white rounded-pcos-xl p-6 shadow-pcos-card">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-pcos-primary" />
                      <h3 className="font-heading font-bold text-lg text-pcos-text">Cycle Regularity</h3>
                    </div>
                    <p className="text-2xl font-heading font-bold text-pcos-primary">
                      {selectedReport.cycle_regularity}
                    </p>
                  </div>
                  
                  {/* Encouragement Message */}
                  <div className="bg-gradient-to-r from-pcos-primary to-pcos-secondary rounded-pcos-xl p-6 text-center">
                    <p className="text-white font-body text-lg leading-relaxed">
                      {selectedReport.hormone_balance_score >= 70 
                        ? "Amazing progress this month! Your body is responding beautifully to all your care and effort 🌟"
                        : "Every step forward counts! Keep showing up for yourself, you're doing so well 💕"}
                    </p>
                  </div>
                  
                  {/* Download Button */}
                  <button
                    data-testid="download-report-button"
                    onClick={() => toast.info('PDF download feature coming soon!')}
                    className="w-full py-4 rounded-full border-2 border-pcos-primary text-pcos-primary font-body font-medium flex items-center justify-center gap-2 hover:bg-pcos-primary hover:text-white transition-all"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download as PDF</span>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}