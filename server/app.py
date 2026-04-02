from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from models import init_db
from routes import api_bp
from auth import auth_bp
from reports import reports_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

import certifi

app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
if app.config["MONGO_URI"] and "tlsCAFile" not in app.config["MONGO_URI"]:
    # Add certifi to fix slow/buggy Windows certificate resolution for MongoDB Atlas
    joiner = "&" if "?" in app.config["MONGO_URI"] else "?"
    app.config["MONGO_URI"] += f"{joiner}tlsCAFile={certifi.where()}"

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev_secret_key_123")
init_db(app)

# Pre-warm connection pool to eliminate the 60+ second initial request delay
with app.app_context():
    from models import mongo
    import threading
    def warmup_db():
        try:
            mongo.cx.admin.command('ping')
            print("[\u2713] Database Connection Pool Warmed Up Successfully.")
        except Exception as e:
            print("[x] Database connection warmup failed:", e)
    threading.Thread(target=warmup_db, daemon=True).start()

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(reports_bp, url_prefix='/api/reports')

@app.route('/')
def home():
    return jsonify({"message": "MedSafe API is running"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
