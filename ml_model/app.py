from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load("credit_model_minimal.pkl")

@app.route("/")
def home():
    return "RupEasy Credit Score API is running."

@app.route("/api/predict", methods=["POST"])
def predict_credit_score():
    try:
        data = request.get_json()

        # Use frontend field names
        income = float(data.get("income", 0))
        expenses = float(data.get("monthly_expenses", 0))  # Fix name mismatch
        existing_loans = int(data.get("existing_loans", 0))

        features = np.array([[income, expenses, existing_loans]])

        predicted_score = model.predict(features)[0]
        score = round(predicted_score)

        if score >= 750:
            verdict = "Excellent"
        elif score >= 600:
            verdict = "Good"
        else:
            verdict = "Needs Improvement"

        return jsonify({
            "score": score,
            "verdict": verdict
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5001)

