from flask import Blueprint, request, jsonify
from ml_service import ml_service
from auth import auth_bp
from models import mongo
from bson.objectid import ObjectId


from auth import token_required
from models import AuditLog, Patient, Drug, SystemStats

api_bp = Blueprint('api', __name__)

@api_bp.route('/assess', methods=['POST'])
@token_required
def assess_risk(current_user):
    # Expects JSON: { "patient_data": {...}, "drug_id": "..." }
    data = request.json
    patient_data = data.get('patient_data')
    drug_id = data.get('drug_id')
    
    if not patient_data or not drug_id:
        return jsonify({"error": "Missing patient data or drug ID"}), 400
        
    # Basic validation of patient data
    required_fields = ['age', 'gender', 'current_medications']
    missing = [f for f in required_fields if f not in patient_data]
    if missing:
        return jsonify({"error": f"Missing patient fields: {', '.join(missing)}"}), 400

    result = ml_service.predict_adr(patient_data, drug_id)
    
    # Audit Log
    AuditLog.log_action(
        user_id=current_user['_id'],
        action="RISK_ASSESSMENT",
        details={"drug_id": drug_id, "risk_level": result['risk_level']},
        ip_address=request.remote_addr
    )
    
    return jsonify(result)

@api_bp.route('/alternatives/<drug_id>', methods=['GET'])
@token_required
def get_alternatives(current_user, drug_id):
    alternatives = ml_service.get_alternatives(drug_id)
    
    AuditLog.log_action(
        user_id=current_user['_id'],
        action="VIEW_ALTERNATIVES",
        details={"drug_id": drug_id, "count": len(alternatives)},
        ip_address=request.remote_addr
    )
    
    return jsonify({"alternatives": alternatives})

@api_bp.route('/patient/<patient_id>', methods=['GET'])
@token_required
def get_patient_history(current_user, patient_id):
    if current_user['role'] not in ['clinician', 'admin']:
         return jsonify({"error": "Unauthorized"}), 403

    try:
        patient = mongo.db.patients.find_one({"_id": ObjectId(patient_id)})
    except:
        return jsonify({"error": "Invalid Patient ID"}), 400

    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    
    patient['_id'] = str(patient['_id'])
    return jsonify(patient)

@api_bp.route('/patients', methods=['POST'])
@token_required
def create_patient(current_user):
    if current_user['role'] not in ['clinician', 'admin']:
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.json
    required_fields = ['name', 'age', 'gender']
    if not all(k in data for k in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
        
    pid = Patient.create(data)
    return jsonify({"message": "Patient created", "patient_id": str(pid)}), 201

@api_bp.route('/patients', methods=['GET'])
@token_required
def list_patients(current_user):
    # If using pagination in future, add limits
    patients = list(Patient.all())
    for p in patients:
        p['_id'] = str(p['_id'])
    return jsonify(patients)

@api_bp.route('/drugs/search', methods=['GET'])
def search_drugs():
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    drugs = Drug.search(query)
    return jsonify(drugs)

@api_bp.route('/assess/override', methods=['POST'])
@token_required
def override_risk(current_user):
    if current_user['role'] != 'clinician':
        return jsonify({"error": "Only clinicians can override"}), 403
        
    data = request.json
    AuditLog.log_action(
        user_id=current_user['_id'],
        action="OVERRIDE_RISK",
        details={
            "drug_id": data.get('drug_id'),
            "risk_level": data.get('risk_level'),
            "reason": data.get('reason'),
            "patient_id": data.get('patient_id')
        },
        ip_address=request.remote_addr
    )
    return jsonify({"message": "Override logged successfully"})

@api_bp.route('/dashboard/stats', methods=['GET'])
@token_required
def get_dashboard_stats(current_user):
    # Returns stats relevant to the user's dashboard
    metrics = SystemStats.get_metrics() # In a real app, filter partly by user
    # For demo, return global metrics
    return jsonify({"metrics": metrics})

@api_bp.route('/admin/stats', methods=['GET'])
@token_required
def get_admin_stats(current_user):
    if current_user['role'] not in ['admin', 'clinician']: # Allow clinician to see stats too for demo
        return jsonify({"error": "Unauthorized"}), 403
        
    metrics = SystemStats.get_metrics()
    recent_logs = list(AuditLog.get_recent(20))
    for log in recent_logs:
        log['_id'] = str(log['_id'])
        log['user_id'] = str(log['user_id']) if log['user_id'] else None
        
    return jsonify({"metrics": metrics, "logs": recent_logs})


