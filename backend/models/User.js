const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['borrower', 'lender'] },
  interestRate: Number,
  maxLoanAmount: Number,
  availableFunds: Number,
  phone: String,         
  salary: Number,
  existing_loans: {
  type: Number,
  default: 0
}

});

module.exports = mongoose.model("User", userSchema);


