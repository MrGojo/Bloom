import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
});

// Auth APIs
export const login = async (password) => {
  const response = await apiClient.post('/auth/login', { password });
  return response.data;
};

// Daily Log APIs
export const createDailyLog = async (log) => {
  const response = await apiClient.post('/daily-log', log);
  return response.data;
};

export const getDailyLog = async (date) => {
  const response = await apiClient.get(`/daily-log/${date}`);
  return response.data;
};

export const getAllDailyLogs = async () => {
  const response = await apiClient.get('/daily-logs');
  return response.data;
};

export const updateDailyLog = async (date, log) => {
  const response = await apiClient.put(`/daily-log/${date}`, log);
  return response.data;
};

// Period Log APIs
export const createPeriodLog = async (log) => {
  const response = await apiClient.post('/period-log', log);
  return response.data;
};

export const getPeriodLogs = async () => {
  const response = await apiClient.get('/period-logs');
  return response.data;
};

export const getPeriodPrediction = async () => {
  const response = await apiClient.get('/period-prediction');
  return response.data;
};

// Boyfriend Message APIs
export const createMessage = async (message) => {
  const response = await apiClient.post('/boyfriend-message', message);
  return response.data;
};

export const getMessages = async () => {
  const response = await apiClient.get('/boyfriend-messages');
  return response.data;
};

export const getDailyMessage = async () => {
  const response = await apiClient.get('/boyfriend-message/daily');
  return response.data;
};

export const deleteMessage = async (messageId) => {
  const response = await apiClient.delete(`/boyfriend-message/${messageId}`);
  return response.data;
};

// Craving APIs
export const getCravings = async () => {
  const response = await apiClient.get('/cravings');
  return response.data;
};

export const getRandomCraving = async () => {
  const response = await apiClient.get('/craving/random');
  return response.data;
};

// Recipe APIs
export const getRecipes = async (category = null, lazyMode = null) => {
  const params = {};
  if (category) params.category = category;
  if (lazyMode !== null) params.lazy_mode = lazyMode;
  const response = await apiClient.get('/recipes', { params });
  return response.data;
};

// Monthly Report APIs
export const getMonthlyReports = async () => {
  const response = await apiClient.get('/monthly-reports');
  return response.data;
};

export const generateMonthlyReport = async (month, year) => {
  const response = await apiClient.post('/monthly-report/generate', null, {
    params: { month, year }
  });
  return response.data;
};

// Email APIs
export const sendDailyReminder = async () => {
  const response = await apiClient.post('/send-daily-reminder');
  return response.data;
};

// Seed data
export const seedData = async () => {
  const response = await apiClient.post('/seed-data');
  return response.data;
};

export default apiClient;