# 🌸 Bloom - PCOS Wellness Tracker

A beautiful, private wellness companion designed to help manage PCOS with love and support.

![Bloom Logo](https://static.prod-images.emergentagent.com/jobs/8d62aaf7-4628-486c-8e37-547cd56df714/images/c590eb9f1efecc0f94048b777d159cc0ab274406b4aaacf1ce9ca6440ce2e5e4.png)

## ✨ Features

### 🌺 Daily Wellness Tracking
- **Daily Habits Tracker**: Track movement, nutrition, sleep, and stress management
- **Water Intake Monitor**: Stay hydrated with visual progress tracking
- **Mood Selector**: Log emotional wellness with easy emoji selection

### 📅 Period & Cycle Tracking
- **Smart Predictions**: Calculates next period and ovulation dates
- **Visual Calendar**: Color-coded calendar showing period days and predictions
- **Cycle History**: Track patterns and regularity over time
- **PCOS-Friendly**: Handles irregular cycles with grace

### 🍽️ Nutrition Support
- **Craving Emergency**: Get healthy alternatives for junk food cravings
  - Maggi → Whole wheat veggie noodles
  - Pizza → Roti pizza or Besan chilla pizza
  - Chips → Roasted makhana
  - And more!
- **PCOS-Friendly Recipes**: Indian recipes optimized for PCOS
- **Lazy Mode Filter**: Quick recipes under 10 minutes

### 💜 Emotional Support
- **Daily Love Messages**: Rotating supportive messages from your partner
- **Refresh Button**: Get a new message anytime you need encouragement
- **Gentle Tone**: No judgment, only support and positivity

### 📊 Progress Tracking
- **Monthly Reports**: Comprehensive wellness summaries
- **Streak Counter**: Celebrate consistency
- **Visual Analytics**: Track mood trends, exercise consistency, and more

### 📱 PWA Features
- **Installable**: Works like a native app on mobile
- **Offline Support**: Access features without internet
- **Push Notifications**: Daily wellness reminders
- **Email Reminders**: Optional email check-ins

## 🎨 Design

- **Theme**: Soft pastel pink & lavender
- **Aesthetic**: Pinterest-inspired, feminine and clean
- **Mobile-First**: Optimized for phone usage
- **Smooth Animations**: Delightful micro-interactions

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)
- React Router
- PWA with Service Worker

### Backend
- FastAPI (Python)
- MongoDB
- Resend (email service)
- Motor (async MongoDB driver)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.9+
- MongoDB

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MrGojo/Bloom.git
cd Bloom
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=bloom_db
CORS_ORIGINS=*
RESEND_API_KEY=your_resend_api_key
SENDER_EMAIL=onboarding@resend.dev
USER_EMAIL=user@example.com
```

3. **Frontend Setup**
```bash
cd frontend
yarn install
```

Create `.env` file:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

4. **Run the Application**

Backend:
```bash
cd backend
python server.py
```

Frontend:
```bash
cd frontend
yarn start
```

5. **Seed Initial Data**
```bash
curl -X POST http://localhost:8001/api/seed-data
```

## 🔑 User Accounts

### User Login
- Password: `grishmasingh`
- Access: All wellness features

### Admin Login (Boyfriend Panel)
- Password: `shuubhamnarrkar`
- Access: Message management panel

## 📱 PWA Installation

### Android
1. Open app in Chrome
2. Tap "Add Bloom to Home Screen"
3. Confirm installation

### iOS
1. Open app in Safari
2. Tap Share button
3. Select "Add to Home Screen"

## 🌟 Key Features Detail

### Craving Emergency System
The app includes a smart alternative suggestion system:
- Select what you're craving
- Get instant healthy PCOS-friendly alternatives
- Includes ingredients, prep time, and recipe steps
- Indian food focused (Maggi, Paneer, Makhana, etc.)

### Period Prediction Logic
- Uses average of last 3 cycles
- Supports manual cycle length setting
- Handles irregular PCOS cycles (21-45 days)
- Alerts for missed periods (>45 days)

### Boyfriend Message System
- Admin can add custom messages
- Includes rotating default messages
- User can refresh to see new messages
- Smooth animations on message change

## 🎯 Roadmap

- [ ] Photo journal for progress tracking
- [ ] Weekly meal prep planner
- [ ] AI-powered food recommendations
- [ ] Wearable device integration
- [ ] Community support features

## 📄 License

This project is private and personal.

## 💝 About

Bloom is a thoughtful wellness companion designed to support the PCOS journey with love, care, and understanding. Every feature is built with empathy and positivity.

---

Made with 💜 for wellness and healing
