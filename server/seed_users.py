
from app import app
from models import mongo
import bcrypt

with app.app_context():
    roles = [
        ("admin@medsafe.com", "Admin User", "admin"),
        ("pharm@medsafe.com", "Pharmacist User", "pharmacist"),
        ("patient@medsafe.com", "Patient User", "patient"),
        ("dr@medsafe.com", "Doctor User", "clinician")
    ]
    
    for email, ignore, role in roles:
        if not mongo.db.users.find_one({"email": email}):
            mongo.db.users.insert_one({
                "email": email,
                "username": ignore,
                "password": bcrypt.hashpw("test1234".encode('utf-8'), bcrypt.gensalt()),
                "role": role,
                "verified": True
            })
            print(f"Created {role} user: {email}")
        else:
            print(f"User {email} already exists")

    if not mongo.db.drugs.find_one({"name": "Aspirin"}):
        mongo.db.drugs.insert_many([
            {"name": "Aspirin", "class": "NSAID", "risk": "Low"},
            {"name": "Warfarin", "class": "Anticoagulant", "risk": "High"},
        ])
        print("Seeded mock drugs")
