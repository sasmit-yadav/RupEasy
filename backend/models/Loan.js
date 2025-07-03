const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  name: String,                     // borrower name
  email: String,                    // borrower email
  amount: Number,                   // loan amount
  lenderEmail: String,     
  salary: Number,         // lender’s email
  status: {                         // application status
    type: String,
    enum: ['Pending', 'approved', 'rejected'],
    default: 'Pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Loan', loanSchema);
