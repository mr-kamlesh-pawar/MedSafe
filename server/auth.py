from flask import Blueprint, request, jsonify
import jwt
import datetime
import os
import bcrypt
from models import mongo
from bson.objectid import ObjectId

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.environ.get('SECRET_KEY', 'your_secret_key')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    users = mongo.db.users
    
    if users.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists'}), 400
        
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    role = data.get('role', 'clinician')
    
    # If the user is a patient, create a patient record first
    patient_record_id = None
    if role == 'patient':
        patients = mongo.db.patients
        patient_record_id = patients.insert_one({
            'name': data['username'],
            'age': data.get('age', 30), # Default age
            'allergies': [],
            'medical_history': [],
            'current_medications': []
        }).inserted_id

    user_id = users.insert_one({
        'username': data['username'],
        'email': data['email'],
        'password': hashed_password,
        'role': role,
        'patient_record_id': patient_record_id
    }).inserted_id
    
    return jsonify({'message': 'User created', 'user_id': str(user_id)}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = mongo.db.users.find_one({'email': data['email']})
    
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        
        return jsonify({
            'token': token, 
            'role': user['role'],
            'user_id': str(user['_id']),
            'patient_record_id': str(user.get('patient_record_id')) if user.get('patient_record_id') else None
        })
        
    return jsonify({'message': 'Invalid credentials'}), 401

from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
            else:
                token = auth_header

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
            if not current_user:
                 return jsonify({'message': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401

        return f(current_user, *args, **kwargs)

    return decorated

