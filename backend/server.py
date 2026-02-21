from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import asyncio
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
USER_EMAIL = os.environ.get('USER_EMAIL')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ========== MODELS ==========

class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    user_id: str
    user_type: str
    user_name: str

class DailyLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    log_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    movement_walk: bool = False
    movement_yoga: bool = False
    movement_sunlight: bool = False
    food_protein_breakfast: bool = False
    food_vegetables: bool = False
    food_water: bool = False
    food_avoided_junk: bool = False
    hormone_sleep: bool = False
    hormone_no_late_snack: bool = False
    hormone_stress_care: bool = False
    water_intake: float = 0.0
    mood: str = ""
    symptoms: List[str] = []
    notes: str = ""
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PeriodLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    period_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    start_date: str
    end_date: Optional[str] = None
    cycle_length: int = 28
    symptoms: List[str] = []
    notes: str = ""
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class BoyfriendMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    message_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    message: str
    is_custom: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CravingAlternative(BaseModel):
    model_config = ConfigDict(extra="ignore")
    craving_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    junk_food: str
    healthy_alternative: str
    ready_made: bool
    recipe_steps: List[str] = []
    prep_time: str
    ingredients: List[str] = []

class Recipe(BaseModel):
    model_config = ConfigDict(extra="ignore")
    recipe_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    prep_time: str
    ingredients: List[str]
    steps: List[str]
    is_lazy_mode: bool = False
    is_pcos_friendly: bool = True
    image_url: str = ""

class MonthlyReport(BaseModel):
    model_config = ConfigDict(extra="ignore")
    report_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    month: str
    year: int
    exercise_consistency: float
    water_average: float
    junk_avoided_count: int
    sleep_average: float
    mood_trends: Dict[str, int]
    cycle_regularity: str
    hormone_balance_score: float
    streak_record: int
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class EmailRequest(BaseModel):
    subject: str
    html_content: str

# ========== HELPER FUNCTIONS ==========

async def send_email_async(subject: str, html_content: str):
    """Send email using Resend"""
    if not USER_EMAIL or not resend.api_key:
        logger.warning("Email not configured")
        return
    
    params = {
        "from": SENDER_EMAIL,
        "to": [USER_EMAIL],
        "subject": subject,
        "html": html_content
    }
    
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent: {email.get('id')}")
        return email
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return None

def calculate_next_period(last_period_date: str, cycle_length: int):
    """Calculate next period date"""
    try:
        last_date = datetime.fromisoformat(last_period_date)
        next_date = last_date + timedelta(days=cycle_length)
        return next_date.isoformat()
    except:
        return None

def calculate_ovulation(last_period_date: str, cycle_length: int):
    """Calculate ovulation date"""
    try:
        last_date = datetime.fromisoformat(last_period_date)
        ovulation_date = last_date + timedelta(days=(cycle_length - 14))
        return ovulation_date.isoformat()
    except:
        return None

# ========== ROUTES ==========

@api_router.get("/")
async def root():
    return {"message": "PCOS Wellness Tracker API"}

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Simple hardcoded login for Grishu and Admin"""
    if request.password == "grishmasingh":
        return LoginResponse(
            success=True,
            message="Welcome back, Grishu! 💕",
            user_id="grishu_user_001",
            user_type="user",
            user_name="Grishu"
        )
    elif request.password == "shuubhamnarrkar":
        return LoginResponse(
            success=True,
            message="Welcome, Shubham! 💜",
            user_id="admin_user_001",
            user_type="admin",
            user_name="Shubham"
        )
    raise HTTPException(status_code=401, detail="Invalid password")

# ========== DAILY LOGS ==========

@api_router.post("/daily-log")
async def create_daily_log(log: DailyLog):
    doc = log.model_dump()
    await db.daily_logs.insert_one(doc)
    return {"success": True, "log_id": log.log_id}

@api_router.get("/daily-log/{date}")
async def get_daily_log(date: str):
    log = await db.daily_logs.find_one({"date": date}, {"_id": 0})
    if not log:
        return None
    return log

@api_router.get("/daily-logs")
async def get_all_daily_logs():
    logs = await db.daily_logs.find({}, {"_id": 0}).sort("date", -1).to_list(100)
    return logs

@api_router.put("/daily-log/{date}")
async def update_daily_log(date: str, log: DailyLog):
    doc = log.model_dump()
    result = await db.daily_logs.update_one(
        {"date": date},
        {"$set": doc},
        upsert=True
    )
    return {"success": True, "modified": result.modified_count}

# ========== PERIOD TRACKER ==========

@api_router.post("/period-log")
async def create_period_log(log: PeriodLog):
    doc = log.model_dump()
    await db.period_logs.insert_one(doc)
    return {"success": True, "period_id": log.period_id}

@api_router.get("/period-logs")
async def get_period_logs():
    logs = await db.period_logs.find({}, {"_id": 0}).sort("start_date", -1).to_list(50)
    return logs

@api_router.get("/period-prediction")
async def get_period_prediction():
    """Calculate next period and ovulation based on last 3 cycles or manual setting"""
    logs = await db.period_logs.find({}, {"_id": 0}).sort("start_date", -1).to_list(3)
    
    if not logs:
        return {"message": "No period data available"}
    
    # Calculate average cycle length from last 3 cycles
    if len(logs) >= 2:
        cycle_lengths = []
        for i in range(len(logs) - 1):
            start1 = datetime.fromisoformat(logs[i]["start_date"])
            start2 = datetime.fromisoformat(logs[i + 1]["start_date"])
            diff = (start1 - start2).days
            if diff > 0:
                cycle_lengths.append(diff)
        
        avg_cycle = int(sum(cycle_lengths) / len(cycle_lengths)) if cycle_lengths else logs[0].get("cycle_length", 28)
    else:
        avg_cycle = logs[0].get("cycle_length", 28)
    
    last_period = logs[0]["start_date"]
    next_period = calculate_next_period(last_period, avg_cycle)
    ovulation = calculate_ovulation(last_period, avg_cycle)
    
    # Check if period is missed (>45 days)
    last_date = datetime.fromisoformat(last_period)
    # Make both datetimes naive for comparison
    now_naive = datetime.now()
    days_since = (now_naive - last_date).days
    is_missed = days_since > 45
    
    return {
        "last_period": last_period,
        "next_period": next_period,
        "ovulation": ovulation,
        "average_cycle_length": avg_cycle,
        "days_since_last_period": days_since,
        "is_missed": is_missed
    }

# ========== BOYFRIEND MESSAGES ==========

@api_router.post("/boyfriend-message")
async def create_message(message: BoyfriendMessage):
    doc = message.model_dump()
    await db.boyfriend_messages.insert_one(doc)
    return {"success": True, "message_id": message.message_id}

@api_router.get("/boyfriend-messages")
async def get_messages():
    messages = await db.boyfriend_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return messages

@api_router.get("/boyfriend-message/daily")
async def get_daily_message():
    """Get a random message for today"""
    messages = await db.boyfriend_messages.find({}, {"_id": 0}).to_list(100)
    if not messages:
        return {"message": "You are healing, my love 💕"}
    
    import random
    return random.choice(messages)

@api_router.delete("/boyfriend-message/{message_id}")
async def delete_message(message_id: str):
    result = await db.boyfriend_messages.delete_one({"message_id": message_id})
    return {"success": True, "deleted": result.deleted_count}

# ========== CRAVINGS & RECIPES ==========

@api_router.post("/craving")
async def create_craving(craving: CravingAlternative):
    doc = craving.model_dump()
    await db.cravings.insert_one(doc)
    return {"success": True, "craving_id": craving.craving_id}

@api_router.get("/cravings")
async def get_cravings():
    cravings = await db.cravings.find({}, {"_id": 0}).to_list(100)
    return cravings

@api_router.get("/craving/random")
async def get_random_craving():
    """Get a random healthy alternative"""
    cravings = await db.cravings.find({}, {"_id": 0}).to_list(100)
    if not cravings:
        return {"message": "No alternatives available"}
    
    import random
    return random.choice(cravings)

@api_router.post("/recipe")
async def create_recipe(recipe: Recipe):
    doc = recipe.model_dump()
    await db.recipes.insert_one(doc)
    return {"success": True, "recipe_id": recipe.recipe_id}

@api_router.get("/recipes")
async def get_recipes(category: Optional[str] = None, lazy_mode: Optional[bool] = None):
    query = {}
    if category:
        query["category"] = category
    if lazy_mode is not None:
        query["is_lazy_mode"] = lazy_mode
    
    recipes = await db.recipes.find(query, {"_id": 0}).to_list(100)
    return recipes

# ========== MONTHLY REPORTS ==========

@api_router.post("/monthly-report")
async def create_monthly_report(report: MonthlyReport):
    doc = report.model_dump()
    await db.monthly_reports.insert_one(doc)
    return {"success": True, "report_id": report.report_id}

@api_router.get("/monthly-reports")
async def get_monthly_reports():
    reports = await db.monthly_reports.find({}, {"_id": 0}).sort("generated_at", -1).to_list(50)
    return reports

@api_router.post("/monthly-report/generate")
async def generate_monthly_report(month: int, year: int):
    """Generate monthly report from daily logs"""
    # Get all logs for the month
    start_date = f"{year}-{month:02d}-01"
    end_date = f"{year}-{month:02d}-31"
    
    logs = await db.daily_logs.find({
        "date": {"$gte": start_date, "$lte": end_date}
    }, {"_id": 0}).to_list(100)
    
    if not logs:
        raise HTTPException(status_code=404, detail="No data for this month")
    
    total_days = len(logs)
    exercise_days = sum(1 for log in logs if log.get("movement_walk") or log.get("movement_yoga"))
    water_total = sum(log.get("water_intake", 0) for log in logs)
    junk_avoided = sum(1 for log in logs if log.get("food_avoided_junk"))
    sleep_days = sum(1 for log in logs if log.get("hormone_sleep"))
    
    moods = {}
    for log in logs:
        mood = log.get("mood", "")
        if mood:
            moods[mood] = moods.get(mood, 0) + 1
    
    exercise_consistency = (exercise_days / total_days) * 100 if total_days > 0 else 0
    water_average = water_total / total_days if total_days > 0 else 0
    sleep_average = (sleep_days / total_days) * 100 if total_days > 0 else 0
    
    # Calculate hormone balance score
    hormone_score = (
        (exercise_consistency * 0.3) +
        (sleep_average * 0.3) +
        ((junk_avoided / total_days * 100) * 0.2 if total_days > 0 else 0) +
        ((water_average / 3) * 100 * 0.2)
    )
    
    # Calculate streak
    streak = 0
    for log in sorted(logs, key=lambda x: x["date"], reverse=True):
        if log.get("movement_walk") or log.get("movement_yoga"):
            streak += 1
        else:
            break
    
    report = MonthlyReport(
        month=str(month),
        year=year,
        exercise_consistency=round(exercise_consistency, 1),
        water_average=round(water_average, 1),
        junk_avoided_count=junk_avoided,
        sleep_average=round(sleep_average, 1),
        mood_trends=moods,
        cycle_regularity="Regular" if len(logs) > 20 else "Irregular",
        hormone_balance_score=round(hormone_score, 1),
        streak_record=streak
    )
    
    doc = report.model_dump()
    await db.monthly_reports.insert_one(doc)
    
    return report

# ========== EMAIL REMINDERS ==========

@api_router.post("/send-reminder")
async def send_reminder(background_tasks: BackgroundTasks, request: EmailRequest):
    """Send email reminder"""
    background_tasks.add_task(send_email_async, request.subject, request.html_content)
    return {"success": True, "message": "Email queued"}

@api_router.post("/send-daily-reminder")
async def send_daily_reminder(background_tasks: BackgroundTasks):
    """Send daily wellness reminder"""
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #FDE2F3 0%, #E5D4FF 100%); border-radius: 20px;">
        <h1 style="color: #7A5C9E; text-align: center;">Good Morning, Grishu! 💕</h1>
        <div style="background: white; padding: 20px; border-radius: 15px; margin: 20px 0;">
            <p style="color: #5D4578; font-size: 16px;">Time for your daily wellness check-in!</p>
            <p style="color: #5D4578;">Remember to:</p>
            <ul style="color: #5D4578;">
                <li>Take a 20-30 min walk 🚶‍♀️</li>
                <li>Drink plenty of water 💧</li>
                <li>Eat your protein breakfast 🥚</li>
                <li>Log your mood and habits 📝</li>
            </ul>
            <p style="color: #7A5C9E; font-weight: bold; text-align: center; margin-top: 20px;">You are healing, my love 💜</p>
        </div>
    </div>
    """
    
    background_tasks.add_task(send_email_async, "Daily Wellness Reminder 💕", html_content)
    return {"success": True, "message": "Reminder sent"}

# ========== SEED DATA ==========

@api_router.post("/seed-data")
async def seed_data():
    """Seed initial data for cravings, recipes, and messages"""
    
    # Seed cravings
    cravings_data = [
        {
            "junk_food": "Maggi",
            "healthy_alternative": "Whole wheat veggie masala noodles with paneer",
            "ready_made": False,
            "recipe_steps": [
                "Boil whole wheat noodles",
                "Sauté mixed vegetables (capsicum, carrot, peas)",
                "Add paneer cubes",
                "Mix with light masala seasoning"
            ],
            "prep_time": "10 minutes",
            "ingredients": ["Whole wheat noodles", "Mixed vegetables", "Paneer", "Light masala"]
        },
        {
            "junk_food": "Chips",
            "healthy_alternative": "Roasted makhana",
            "ready_made": True,
            "recipe_steps": ["Buy roasted makhana from store", "Season with light salt or chaat masala"],
            "prep_time": "2 minutes",
            "ingredients": ["Makhana", "Salt/Chaat masala"]
        },
        {
            "junk_food": "Kurkure",
            "healthy_alternative": "Roasted chana",
            "ready_made": True,
            "recipe_steps": ["Buy roasted chana", "Add lemon and chaat masala if desired"],
            "prep_time": "1 minute",
            "ingredients": ["Roasted chana", "Lemon", "Chaat masala"]
        },
        {
            "junk_food": "Cold Drink",
            "healthy_alternative": "Lemon sparkling water",
            "ready_made": False,
            "recipe_steps": ["Mix sparkling water with fresh lemon juice", "Add mint leaves", "Optional: add a pinch of black salt"],
            "prep_time": "3 minutes",
            "ingredients": ["Sparkling water", "Lemon", "Mint", "Black salt"]
        },
        {
            "junk_food": "Fries",
            "healthy_alternative": "Air-fried sweet potato",
            "ready_made": False,
            "recipe_steps": ["Cut sweet potato into wedges", "Toss with olive oil and paprika", "Air fry for 15 minutes"],
            "prep_time": "8 minutes",
            "ingredients": ["Sweet potato", "Olive oil", "Paprika", "Salt"]
        },
        {
            "junk_food": "Chocolate",
            "healthy_alternative": "70% dark chocolate (2 pieces)",
            "ready_made": True,
            "recipe_steps": ["Buy 70% or higher dark chocolate", "Have 2 small pieces"],
            "prep_time": "1 minute",
            "ingredients": ["Dark chocolate 70%"]
        }
    ]
    
    for craving_data in cravings_data:
        craving = CravingAlternative(**craving_data)
        await db.cravings.delete_many({"junk_food": craving_data["junk_food"]})
        await db.cravings.insert_one(craving.model_dump())
    
    # Seed recipes
    recipes_data = [
        {
            "name": "Paneer Bhurji",
            "category": "Breakfast",
            "prep_time": "10 minutes",
            "ingredients": ["Paneer", "Onion", "Tomato", "Spices", "Oil"],
            "steps": ["Crumble paneer", "Sauté onions and tomatoes", "Add paneer and spices", "Cook for 5 minutes"],
            "is_lazy_mode": True,
            "is_pcos_friendly": True,
            "image_url": "https://images.pexels.com/photos/33709317/pexels-photo-33709317.jpeg"
        },
        {
            "name": "Moong Dal Chilla",
            "category": "Breakfast",
            "prep_time": "15 minutes",
            "ingredients": ["Moong dal", "Onion", "Tomato", "Green chili", "Coriander"],
            "steps": ["Soak dal for 2 hours", "Grind to paste", "Add veggies", "Make chillas on tawa"],
            "is_lazy_mode": False,
            "is_pcos_friendly": True,
            "image_url": "https://images.unsplash.com/photo-1617622141573-2e00d8818f3f"
        },
        {
            "name": "Oats with Berries",
            "category": "Breakfast",
            "prep_time": "5 minutes",
            "ingredients": ["Oats", "Almond milk", "Berries", "Nuts", "Honey"],
            "steps": ["Mix oats with almond milk", "Microwave for 2 mins", "Top with berries and nuts"],
            "is_lazy_mode": True,
            "is_pcos_friendly": True,
            "image_url": "https://images.pexels.com/photos/30552849/pexels-photo-30552849.jpeg"
        },
        {
            "name": "Brown Rice with Dal",
            "category": "Lunch",
            "prep_time": "20 minutes",
            "ingredients": ["Brown rice", "Moong dal", "Ghee", "Cumin"],
            "steps": ["Pressure cook dal and rice together", "Temper with cumin and ghee"],
            "is_lazy_mode": False,
            "is_pcos_friendly": True,
            "image_url": "https://images.pexels.com/photos/33709317/pexels-photo-33709317.jpeg"
        },
        {
            "name": "Sprouts Salad",
            "category": "Snack",
            "prep_time": "5 minutes",
            "ingredients": ["Mixed sprouts", "Cucumber", "Tomato", "Lemon", "Chaat masala"],
            "steps": ["Mix all ingredients", "Add lemon and spices"],
            "is_lazy_mode": True,
            "is_pcos_friendly": True,
            "image_url": "https://images.unsplash.com/photo-1617622141573-2e00d8818f3f"
        },
        {
            "name": "Vegetable Soup",
            "category": "Dinner",
            "prep_time": "15 minutes",
            "ingredients": ["Mixed vegetables", "Vegetable stock", "Ginger", "Garlic"],
            "steps": ["Boil vegetables in stock", "Blend if desired", "Season with herbs"],
            "is_lazy_mode": False,
            "is_pcos_friendly": True,
            "image_url": "https://images.unsplash.com/photo-1617622141573-2e00d8818f3f"
        }
    ]
    
    for recipe_data in recipes_data:
        recipe = Recipe(**recipe_data)
        await db.recipes.delete_many({"name": recipe_data["name"]})
        await db.recipes.insert_one(recipe.model_dump())
    
    # Seed default boyfriend messages
    messages_data = [
        "You are healing, my love 💕",
        "So proud of you for showing up today! 💜",
        "One day at a time, baby. You've got this! 🌸",
        "Your body is working with you, not against you 🌺",
        "Every small step counts. I see your effort! 💖",
        "You are stronger than you know, Grishu 💪✨",
        "Taking care of yourself is an act of love 🌷",
        "Progress, not perfection. You're doing amazing! 🌟",
        "I'm here with you every step of the way 💕",
        "Your health matters. You matter. I love you! 💜"
    ]
    
    for msg_text in messages_data:
        message = BoyfriendMessage(message=msg_text, is_custom=False)
        await db.boyfriend_messages.delete_many({"message": msg_text})
        await db.boyfriend_messages.insert_one(message.model_dump())
    
    return {"success": True, "message": "Data seeded successfully"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()