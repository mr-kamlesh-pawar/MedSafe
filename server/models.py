from flask_pymongo import PyMongo
from flask import current_app
from bson import ObjectId
from datetime import datetime

mongo = PyMongo()

def init_db(app):
    mongo.init_app(app)

# Helper to format MongoDB objects
def format_doc(doc):
    if not doc:
        return None
    doc['_id'] = str(doc['_id'])
    return doc

class User:
    collection = 'users'
    
    @staticmethod
    def create(data):
        return mongo.db[User.collection].insert_one(data).inserted_id

    @staticmethod
    def find_by_email(email):
        return mongo.db[User.collection].find_one({'email': email})

class Patient:
    collection = 'patients'
    
    @staticmethod
    def create(data):
        data['created_at'] = datetime.utcnow()
        # Ensure fields exist
        data.setdefault('allergies', [])
        data.setdefault('medical_history', [])
        data.setdefault('current_medications', [])
        return mongo.db[Patient.collection].insert_one(data).inserted_id

    @staticmethod
    def find_by_id(id):
        return mongo.db[Patient.collection].find_one({'_id': ObjectId(id)})

    @staticmethod
    def search(query):
        # Case-insensitive search by name
        return mongo.db[Patient.collection].find({'name': {'$regex': query, '$options': 'i'}})

    @staticmethod
    def all():
        return mongo.db[Patient.collection].find().sort('created_at', -1)

class Drug:
    collection = 'drugs'
    
    @staticmethod
    def search(query):
        # Mock database of drugs for autocomplete
        # In a real app, this would query a loaded DB
        drugs = [
            "Aspirin", "Warfarin", "Metformin", "Lisinopril", "Atorvastatin", 
            "Amoxicillin", "Ibuprofen", "Omeprazole", "Losartan", "Gabapentin",
            "Paracetamol", "Simvastatin", "Levothyroxine", "Amlodipine"
        ]
        return [d for d in drugs if query.lower() in d.lower()]

class SystemStats:
    @staticmethod
    def get_metrics():
        return {
            "total_users": mongo.db.users.count_documents({}),
            "total_assessments": mongo.db.audit_logs.count_documents({"action": "RISK_ASSESSMENT"}),
            "high_risk_alerts": mongo.db.audit_logs.count_documents({"details.risk_level": {"$in": ["High", "Critical"]}}),
            "overrides": mongo.db.audit_logs.count_documents({"action": "OVERRIDE_RISK"}),
        }

class AuditLog:
    collection = 'audit_logs'

    @staticmethod
    def log_action(user_id, action, details, ip_address=None):
        log_entry = {
            'user_id': ObjectId(user_id) if user_id else None,
            'action': action,
            'details': details,
            'ip_address': ip_address,
            'timestamp': datetime.utcnow()
        }
        return mongo.db[AuditLog.collection].insert_one(log_entry).inserted_id

    @staticmethod
    def get_recent(limit=50):
        return mongo.db[AuditLog.collection].find().sort('timestamp', -1).limit(limit)


