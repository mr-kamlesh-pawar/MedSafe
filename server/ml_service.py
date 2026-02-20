from models import mongo
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import numpy as np
import shap
import pickle
import os

class MLService:
    def __init__(self):
        self.model = None
        self.explainer = None
        self.load_model()
        
    def load_model(self):
        # Placeholder for loading model
        # if os.path.exists('model.pkl'):
        #     with open('model.pkl', 'rb') as f:
        #         self.model = pickle.load(f)
        pass # Initialize with dummy model or train on startup

    def predict_adr(self, patient_data, drug_id):
        # 1. Rule-based Interaction Check
        interactions = self.check_interactions(patient_data.get('current_medications', []), drug_id)
        
        # If critical interactions found, return immediately (Rule-Based Filter)
        if interactions:
             return {
                "risk_score": 1.0,
                "risk_level": "Critical",
                "interactions": interactions,
                "shap_values": [], # No ML explanation needed for hard rules
                "recommendation": "Contraindicated due to known interaction."
            }

        # 2. ML Prediction (Mocked for now)
        # Features: Age, Weight, Gender (Encoded), Lab Results...
        risk_score = np.random.beta(2, 5) # Skewed towards lower risk
        
        risk_level = "Low"
        if risk_score > 0.7:
            risk_level = "High"
        elif risk_score > 0.4:
            risk_level = "Medium"
            
        # 3. SHAP Explanation (Simulated)
        shap_values = [
            {"feature": "Age", "value": 0.1, "contribution": "positive"},
            {"feature": "Creatinine", "value": 0.3, "contribution": "positive"}, 
            {"feature": "Drug Interaction", "value": -0.05, "contribution": "negative"}
        ]
            
        return {
            "risk_score": float(round(risk_score, 2)),
            "risk_level": risk_level,
            "interactions": [],
            "shap_values": shap_values
        }


    def check_interactions(self, current_meds, new_drug):
        # Mock database of interactions
        INTERACTIONS = {
            ("Aspirin", "Warfarin"): "Increased bleeding risk",
            ("Lisinopril", "Potassium"): "Risk of hyperkalemia",
            ("Ibuprofen", "Lisinopril"): "Risk of kidney damage"
        }
        
        found_interactions = []
        for med in current_meds:
            pair = tuple(sorted((med, new_drug)))
            if pair in INTERACTIONS:
                found_interactions.append(INTERACTIONS[pair])
                
        return found_interactions

    def get_alternatives(self, drug_id):
        # Mock alternatives based on therapeutic class
        alternatives_db = {
            "Warfarin": [
                {"name": "Apixaban", "risk_reduction": "Lower bleeding risk"},
                {"name": "Rivaroxaban", "risk_reduction": "Standard alternative"}
            ],
            "Lisinopril": [
                {"name": "Losartan", "risk_reduction": "Reduced cough side effect"},
                {"name": "Amlodipine", "risk_reduction": "Calcium channel blocker option"}
            ]
        }
        return alternatives_db.get(drug_id, [])

ml_service = MLService()
