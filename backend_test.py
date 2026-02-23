import requests
import sys
import json
from datetime import datetime

class PCOSAPITester:
    def __init__(self, base_url="https://wellness-bloom-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                self.failed_tests.append(f"{name} - Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"{name} - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root"""
        return self.run_test("API Root", "GET", "api/", 200)

    def test_login_valid(self):
        """Test login with valid password"""
        return self.run_test(
            "Valid Login",
            "POST",
            "api/auth/login",
            200,
            data={"password": "grishu2025"}
        )

    def test_login_invalid(self):
        """Test login with invalid password"""
        return self.run_test(
            "Invalid Login",
            "POST",
            "api/auth/login",
            401,
            data={"password": "wrong_password"}
        )

    def test_daily_log_operations(self):
        """Test daily log CRUD operations"""
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Test creating daily log
        daily_log_data = {
            "date": today,
            "movement_walk": True,
            "movement_yoga": False,
            "food_protein_breakfast": True,
            "water_intake": 2.5,
            "mood": "happy"
        }
        
        success, response = self.run_test(
            "Create Daily Log",
            "POST",
            "api/daily-log",
            200,
            data=daily_log_data
        )
        
        if success:
            # Test getting daily log
            self.run_test(
                "Get Daily Log",
                "GET",
                f"api/daily-log/{today}",
                200
            )
            
            # Test updating daily log
            daily_log_data["mood"] = "excited"
            self.run_test(
                "Update Daily Log",
                "PUT", 
                f"api/daily-log/{today}",
                200,
                data=daily_log_data
            )

    def test_period_log_operations(self):
        """Test period log operations"""
        period_data = {
            "start_date": "2024-01-15",
            "cycle_length": 28,
            "symptoms": ["cramps", "fatigue"]
        }
        
        # Test creating period log
        success, response = self.run_test(
            "Create Period Log",
            "POST",
            "api/period-log",
            200,
            data=period_data
        )
        
        if success:
            # Test getting period logs
            self.run_test(
                "Get Period Logs",
                "GET",
                "api/period-logs",
                200
            )
            
            # Test period prediction
            self.run_test(
                "Period Prediction",
                "GET",
                "api/period-prediction",
                200
            )

    def test_boyfriend_message_operations(self):
        """Test boyfriend message operations"""
        message_data = {
            "message": "Test message for Grishu",
            "is_custom": True
        }
        
        # Test creating message
        success, response = self.run_test(
            "Create Boyfriend Message",
            "POST",
            "api/boyfriend-message",
            200,
            data=message_data
        )
        
        message_id = None
        if success and 'message_id' in response:
            message_id = response['message_id']
        
        # Test getting messages
        self.run_test(
            "Get Boyfriend Messages",
            "GET",
            "api/boyfriend-messages",
            200
        )
        
        # Test daily message
        self.run_test(
            "Get Daily Message",
            "GET",
            "api/boyfriend-message/daily",
            200
        )
        
        # Test delete message if created
        if message_id:
            self.run_test(
                "Delete Boyfriend Message",
                "DELETE",
                f"api/boyfriend-message/{message_id}",
                200
            )

    def test_craving_operations(self):
        """Test craving and recipe operations"""
        # Test getting cravings
        self.run_test(
            "Get Cravings",
            "GET",
            "api/cravings",
            200
        )
        
        # Test random craving
        self.run_test(
            "Get Random Craving",
            "GET",
            "api/craving/random",
            200
        )
        
        # Test getting recipes
        self.run_test(
            "Get All Recipes",
            "GET",
            "api/recipes",
            200
        )
        
        # Test filtered recipes
        self.run_test(
            "Get Lazy Mode Recipes",
            "GET",
            "api/recipes?lazy_mode=true",
            200
        )
        
        self.run_test(
            "Get Breakfast Recipes",
            "GET",
            "api/recipes?category=Breakfast",
            200
        )

    def test_monthly_report_operations(self):
        """Test monthly report operations"""
        # Test getting monthly reports
        self.run_test(
            "Get Monthly Reports",
            "GET",
            "api/monthly-reports",
            200
        )
        
        # Test generating monthly report
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        self.run_test(
            "Generate Monthly Report",
            "POST",
            f"api/monthly-report/generate?month={current_month}&year={current_year}",
            200
        )

    def test_seed_data(self):
        """Test seeding initial data"""
        return self.run_test(
            "Seed Initial Data",
            "POST",
            "api/seed-data",
            200
        )

def main():
    print("🧪 Starting PCOS Wellness Tracker API Tests...")
    print("=" * 50)
    
    tester = PCOSAPITester()
    
    # Test basic connectivity
    tester.test_root_endpoint()
    
    # Seed data first
    tester.test_seed_data()
    
    # Test authentication
    tester.test_login_valid()
    tester.test_login_invalid()
    
    # Test main functionalities
    tester.test_daily_log_operations()
    tester.test_period_log_operations()
    tester.test_boyfriend_message_operations()
    tester.test_craving_operations()
    tester.test_monthly_report_operations()
    
    # Print results
    print(f"\n{'='*50}")
    print(f"📊 Tests Summary: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   • {failure}")
    else:
        print("✅ All tests passed!")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())