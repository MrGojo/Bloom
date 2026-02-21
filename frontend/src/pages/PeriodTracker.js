import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { getPeriodLogs, createPeriodLog, getPeriodPrediction } from '../utils/api';
import { formatDisplayDate, getTodayString } from '../utils/dateHelpers';
import { format, parseISO, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, isWithinInterval, addDays } from 'date-fns';
import { toast } from 'sonner';

export default function PeriodTracker() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [newPeriodDate, setNewPeriodDate] = useState(getTodayString());
  const [cycleLength, setCycleLength] = useState(28);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [logsData, predictionData] = await Promise.all([
        getPeriodLogs(),
        getPeriodPrediction().catch(() => null)
      ]);
      setLogs(logsData || []);
      setPrediction(predictionData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleAddPeriod = async () => {
    try {
      await createPeriodLog({
        start_date: newPeriodDate,
        cycle_length: cycleLength
      });
      toast.success('Period logged successfully!');
      setShowAddPeriod(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to log period');
    }
  };
  
  const isPeriodDay = (date) => {
    return logs.some(log => {
      const startDate = parseISO(log.start_date);
      const endDate = log.end_date ? parseISO(log.end_date) : addDays(startDate, 5);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };
  
  const isPredictedDay = (date) => {
    if (!prediction?.next_period) return false;
    const predictedDate = parseISO(prediction.next_period);
    const endDate = addDays(predictedDate, 5);
    return isWithinInterval(date, { start: predictedDate, end: endDate });
  };
  
  const isOvulationDay = (date) => {
    if (!prediction?.ovulation) return false;
    return isSameDay(date, parseISO(prediction.ovulation));
  };
  
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div data-testid="period-tracker-page" className="min-h-screen bg-pcos-background pb-24">
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
            <h1 className="text-2xl font-heading font-bold text-pcos-text">Period Tracker</h1>
            <motion.button
              data-testid="add-period-button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddPeriod(!showAddPeriod)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-pcos-primary to-pcos-secondary flex items-center justify-center shadow-pcos-button"
            >
              <Plus className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Add Period Form */}
          {showAddPeriod && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-pcos-xl p-6 shadow-pcos-card space-y-4"
            >
              <h3 className="font-heading font-bold text-lg text-pcos-text">Log Period</h3>
              <div>
                <label className="block text-sm font-body font-medium text-pcos-text mb-2">
                  Start Date
                </label>
                <input
                  data-testid="period-date-input"
                  type="date"
                  value={newPeriodDate}
                  onChange={(e) => setNewPeriodDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-pcos-border focus:border-pcos-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-pcos-text mb-2">
                  Cycle Length (days)
                </label>
                <input
                  data-testid="cycle-length-input"
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(parseInt(e.target.value))}
                  min="21"
                  max="45"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-pcos-border focus:border-pcos-primary outline-none"
                />
              </div>
              <button
                data-testid="submit-period-button"
                onClick={handleAddPeriod}
                className="w-full py-3 rounded-full bg-gradient-to-r from-pcos-primary to-pcos-secondary text-white font-body font-medium shadow-pcos-button"
              >
                Save Period
              </button>
            </motion.div>
          )}
          
          {/* Prediction Info */}
          {prediction && (
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-pcos-xl p-6 space-y-3">
              <h3 className="font-heading font-bold text-lg text-pcos-text">Predictions</h3>
              <div className="space-y-2">
                {prediction.next_period && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-body text-pcos-text">Next Period:</span>
                    <span className="font-body font-medium text-pcos-text">
                      {formatDisplayDate(prediction.next_period)}
                    </span>
                  </div>
                )}
                {prediction.ovulation && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-body text-pcos-text">Ovulation:</span>
                    <span className="font-body font-medium text-pcos-text">
                      {formatDisplayDate(prediction.ovulation)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-pcos-text">Avg Cycle:</span>
                  <span className="font-body font-medium text-pcos-text">
                    {prediction.average_cycle_length} days
                  </span>
                </div>
                {prediction.is_missed && (
                  <div className="mt-3 p-3 bg-pcos-error/20 rounded-xl">
                    <p className="text-sm font-body text-red-700">
                      Period is late (45+ days). Consider consulting your doctor.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Calendar */}
          <div className="bg-white rounded-pcos-xl p-6 shadow-pcos-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-pcos-text">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <CalendarIcon className="w-5 h-5 text-pcos-primary" />
            </div>
            
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-body font-medium text-pcos-text-muted">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((date, i) => {
                const isPeriod = isPeriodDay(date);
                const isPredicted = isPredictedDay(date);
                const isOvulation = isOvulationDay(date);
                const isToday = isSameDay(date, new Date());
                
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-body relative ${
                      isPeriod ? 'bg-pink-500 text-white font-bold' :
                      isPredicted ? 'bg-pink-200 text-pcos-text border-2 border-dashed border-pink-400' :
                      isOvulation ? 'bg-purple-400 text-white' :
                      isToday ? 'bg-pcos-primary text-white font-bold' :
                      'text-pcos-text hover:bg-pcos-secondary/20'
                    }`}
                  >
                    {format(date, 'd')}
                  </motion.div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-pcos-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-body">
                <div className="w-4 h-4 rounded bg-pink-500"></div>
                <span className="text-pcos-text-muted">Period days</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-body">
                <div className="w-4 h-4 rounded bg-pink-200 border-2 border-dashed border-pink-400"></div>
                <span className="text-pcos-text-muted">Predicted period</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-body">
                <div className="w-4 h-4 rounded bg-purple-400"></div>
                <span className="text-pcos-text-muted">Ovulation</span>
              </div>
            </div>
          </div>
          
          {/* Period History */}
          <div className="bg-white rounded-pcos-xl p-6 shadow-pcos-card">
            <h3 className="font-heading font-bold text-lg text-pcos-text mb-4">Recent Cycles</h3>
            <div className="space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div key={log.period_id} className="flex justify-between items-center p-3 bg-pcos-background rounded-xl">
                  <div>
                    <div className="font-body font-medium text-pcos-text">
                      {formatDisplayDate(log.start_date)}
                    </div>
                    {log.cycle_length && (
                      <div className="text-xs text-pcos-text-muted font-body">
                        {log.cycle_length} day cycle
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}