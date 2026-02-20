from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from models import init_db
from routes import api_bp
from auth import auth_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev_secret_key_123")
init_db(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return jsonify({"message": "MedSafe API is running"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
