// models/Message.js
const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  from: String,
  body: String,
  date: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  from: String,        // borrower email
  to: String,          // lender email
  subject: String,
  body: String,
  date: {
    type: Date,
    default: Date.now
  },
  replies: [ReplySchema]
});

module.exports = mongoose.model('Message', messageSchema);
