# RupEasy

RupEasy is a digital microloan and financial management platform designed for aspiring entrepreneurs and small businesses. It leverages AI-driven analysis to evaluate loan applications and provides a simple, secure, and transparent way to access microloans and track your finances.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **ML Model:** Python (Flask or similar, in `/model` folder)
- **Other:** AI-based credit scoring, RESTful APIs

## Features

- AI-powered microloan eligibility and approval
- Track income and expenses with categories and reports
- User-friendly dashboard and responsive design
- Secure data handling and export options

### Prerequisites

- [Node.js](https://nodejs.org/) (version >= 14)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
  
## How to Test

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sasmit-yadav/RupEasy.git
   cd RupEasy
   ```

2. **Start the Machine Learning Model (Python):**
   - Go to the model directory:
     ```bash
     cd ml_model
     ```
   - Install Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Start the ML model server:
     ```bash
     python3 app.py
     ```
   - The model server will run (usually on port 5001 or as configured).

3. **Backend Setup (Node.js):**
   - Open a new terminal window and go to the backend directory:
     ```bash
     cd ../backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the backend server:
     ```bash
     npm start
     ```
   - The backend will be available at `http://localhost:5000`.

4. **Frontend Setup:**
   - Open another terminal and go to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - You can use a simple HTTP server or open the HTML files directly in your browser.
   - For local testing, run:
     ```bash
     npx serve .
     ```
   - Visit `http://localhost:3000` (or the port shown) to access the app.

5. **Usage:**
   - Sign up as a borrower or lender.
   - Apply for a microloan, check eligibility, and track your financial activities on the dashboard and much more.

---
