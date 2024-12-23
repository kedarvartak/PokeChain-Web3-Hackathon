from app import create_app
from dotenv import load_dotenv
import os

load_dotenv()

app = create_app()

if __name__ == "__main__":
    print(f"Using LLM {os.getenv('GEMINI_MODEL_NAME')}")
    app.run(debug=os.getenv("FLASK_ENV") == "development", host='0.0.0.0')