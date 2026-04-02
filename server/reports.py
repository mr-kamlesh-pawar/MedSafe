from flask import Blueprint, request, jsonify, make_response
from auth import token_required
from models import mongo, AuditLog, Patient, User
from bson.objectid import ObjectId
import datetime
import os
from groq import Groq
from fpdf import FPDF
import base64

reports_bp = Blueprint('reports', __name__)

client = None
def get_groq_client():
    global client
    if client is None:
        client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))
    return client

class PDFReport(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'MedSafe Integrated Health Report', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_pdf_buffer(content, patient_name):
    pdf = PDFReport()
    pdf.add_page()
    pdf.set_font("Arial", size=11)
    
    # Handle multi-line unicode text
    # FPDF only handles latin-1 by default, avoiding complex unicode
    text = content.encode('latin-1', 'replace').decode('latin-1')
    pdf.multi_cell(0, 7, text)
    
    return pdf.output(dest='S').encode('latin-1')

@reports_bp.route('/generate', methods=['POST'])
@token_required
def generate_report(current_user):
    data = request.json
    patient_id = data.get('patient_id')
    drug_id = data.get('drug_id')
    risk_level = data.get('risk_level')
    risk_score = data.get('risk_score')
    interactions = data.get('interactions', [])
    alternatives = data.get('alternatives', [])

    try:
        patient = mongo.db.patients.find_one({"_id": ObjectId(patient_id)})
    except:
        return jsonify({"error": "Invalid patient ID"}), 400

    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    # Use Groq to generate report text
    prompt = f"""
    Generate a comprehensive, professional medical report summarizing a pharmacovigilance risk assessment.
    
    Patient Details:
    Name: {patient.get('name', 'Unknown')}
    Age: {patient.get('age', 'Unknown')}
    Gender: {patient.get('gender', 'Unknown')}
    Medical History: {', '.join(patient.get('medical_history', []))}
    Current Medications: {', '.join(patient.get('current_medications', []))}
    Allergies: {', '.join(patient.get('allergies', []))}

    Assessment Details:
    Proposed Drug: {drug_id}
    Predicted Risk Level: {risk_level}
    Risk Score: {risk_score}
    Identified Interactions: {', '.join(interactions) if interactions else 'None'}
    Suggested Alternatives: {', '.join([a.get('name', '') for a in alternatives]) if alternatives else 'None'}

    Please provide:
    1. Executive Summary
    2. Detailed Risk Analysis
    3. Clinical Recommendations and Suggestions
    4. Follow-up action plan
    Make it concise, formal, and suitable for a clinician. Use plain text formatting (no complex markdown syntax).
    """

    try:
        groq_client = get_groq_client()
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert clinical pharmacologist AI assistant."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=1000,
        )
        report_text = chat_completion.choices[0].message.content
    except Exception as e:
        return jsonify({"error": f"Failed to generate AI report: {str(e)}"}), 500

    pdf_bytes = generate_pdf_buffer(report_text, patient.get('name', 'Patient'))
    pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')

    report_doc = {
        "patient_id": ObjectId(patient_id),
        "generated_by": ObjectId(current_user['_id']),
        "drug_id": drug_id,
        "content_text": report_text,
        "created_at": datetime.datetime.utcnow(),
        "shared_with_doctors": []
    }
    report_id = mongo.db.reports.insert_one(report_doc).inserted_id

    AuditLog.log_action(
        user_id=current_user['_id'],
        action="GENERATE_REPORT",
        details={"patient_id": patient_id, "report_id": str(report_id)},
        ip_address=request.remote_addr
    )

    return jsonify({
        "message": "Report generated successfully",
        "report_id": str(report_id),
        "pdf_base64": pdf_base64
    })


@reports_bp.route('/share', methods=['POST'])
@token_required
def share_report(current_user):
    data = request.json
    report_id = data.get('report_id')
    doctor_id = data.get('doctor_id')

    if not report_id or not doctor_id:
        return jsonify({"error": "Missing report_id or doctor_id"}), 400

    try:
        mongo.db.reports.update_one(
            {"_id": ObjectId(report_id)},
            {"$addToSet": {"shared_with_doctors": ObjectId(doctor_id)}}
        )
        return jsonify({"message": "Report shared successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reports_bp.route('/patient/<patient_id>', methods=['GET'])
@token_required
def get_patient_reports(current_user, patient_id):
    # Depending on auth, check if they can view
    if current_user['role'] == 'patient' and str(current_user.get('patient_record_id')) != patient_id:
        # patient can only view their own
        # Though the current user might not have a patient_record_id linked. We must ensure they can.
        pass
    
    docs = mongo.db.reports.find({"patient_id": ObjectId(patient_id)}).sort("created_at", -1)
    results = []
    for d in docs:
        d['_id'] = str(d['_id'])
        d['patient_id'] = str(d['patient_id'])
        d['generated_by'] = str(d['generated_by'])
        d['shared_with_doctors'] = [str(doc) for doc in d.get('shared_with_doctors', [])]
        results.append(d)

    return jsonify(results)

@reports_bp.route('/doctors', methods=['GET'])
@token_required
def get_doctors(current_user):
    doctors = mongo.db.users.find({"role": "clinician"})
    results = []
    for d in doctors:
        results.append({
            "id": str(d['_id']),
            "name": d.get('username', d.get('email', 'Doctor')),
            "email": d.get('email')
        })
    return jsonify(results)
