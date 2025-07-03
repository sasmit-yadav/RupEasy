import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

# Step 1: Generate synthetic dataset
np.random.seed(42)
size = 1000

income = np.random.randint(8000, 100000, size)
expenses = np.random.randint(3000, 80000, size)
existing_loans = np.random.randint(0, 6, size)

df = pd.DataFrame({
    "income": income,
    "expenses": expenses,
    "existing_loans": existing_loans
})

#  Step 2: Simulate credit score
df["credit_score"] = (
    (df["income"] / 1000) * 10
    - (df["expenses"] / 1000) * 5
    - df["existing_loans"] * 20
    + np.random.normal(0, 30, size)
).clip(300, 900).round()

# Step 3: Prepare features and labels
X = df[["income", "expenses", "existing_loans"]]
y = df["credit_score"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#  Step 4: Train the model
model = GradientBoostingRegressor(n_estimators=150, learning_rate=0.1, max_depth=3, random_state=42)
model.fit(X_train, y_train)

# Step 5: Evaluate
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("Evaluation Results:")
print("MAE:", round(mae, 2))
print("RMSE:", round(rmse, 2))
print("R² Score:", round(r2, 4))

# Step 6: Save model
joblib.dump(model, "credit_model_minimal.pkl")
print("✅ Model saved as credit_model_minimal.pkl")
