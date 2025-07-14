const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan");
const User = require("../models/User");
const Message = require("../models/Message");

let users = [];
const loans = [];
// routes/auth.js
router.post("/signup", async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    interestRate,
    maxLoanAmount,
    availableFunds,
    salary,
  } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing fields" });

  }

  try {
    const existing = await User.findOne({ email });

    if (existing) return res.status(409).json({ error: "User already exists" });

    const userData = { name, email, password, role };

    if (role === "lender") {

      userData.interestRate = interestRate;
      userData.maxLoanAmount = maxLoanAmount;
      userData.availableFunds = availableFunds;
    }

    if (role === "borrower") {
      userData.salary = salary;
    }


    const user = new User(userData);
    await user.save();

    res.status(201).json({
      message: "Signup successful",
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/signin", async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.status(200).json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,

    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/apply-loan", async (req, res) => {
  const { name, email, amount, lenderEmail } = req.body;

  if (!name || !email || !amount || !lenderEmail) {
    return res.status(400).json({ error: "Missing loan data" });
  }

  try {
    // 1. Save new loan
    const newLoan = new Loan({ name, email, amount, lenderEmail });
    await newLoan.save();

    // 2. Update borrower's existing_loans
    const updatedUser = await User.findOneAndUpdate(
      { email }, // or use userId if available
      { $inc: { existing_loans: 1 } },
      { new: true }
    );

    if (!updatedUser) {
      console.warn(`User not found with email: ${email}`);
    }

    res.status(200).json({
      message: "Loan application submitted",
      updated_loans: updatedUser?.existing_loans ?? "N/A",
    });
  } catch (err) {
    console.error("Loan save error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/my-loans", async (req, res) => {

  const { email } = req.query;

  console.log(" /my-loans called with email:", email);

  if (!email) {

    return res.status(400).json({ error: "Missing email" });

  }

  try {
    const borrower = await User.findOne({ email });
    console.log(" Borrower found:", borrower);

    if (!borrower) {
      console.log(" Borrower not found.");

      return res.status(404).json({ error: "Borrower not found" });

    }

    const loans = await Loan.find({ email }).sort({ date: -1 });
    console.log("Loans found:", loans.length);

    res.status(200).json({
      borrower: {
        name: borrower.name,
        email: borrower.email,
        salary: borrower.salary,
      },

      loans,
    });
  } catch (err) {
    console.error(" Error in /my-loans:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/lender-dashboard", (req, res) => {
  res.json({
    totalLoans: loans.length,
    interestEarned: 4500,

    activeLoans: loans.filter((l) => l.status === "Pending").length,
    loans,
  });
});

router.get("/lender-loans", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Missing email" });


  try {
    const loans = await Loan.find({ lenderEmail: email });
    res.status(200).json(loans);
  } catch (err) {

    console.error("Lender fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/update-loan-status/:id", async (req, res) => {
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(loan);
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ error: "Server error" });

  }
});

// GET /lenders

router.get("/lenders", async (req, res) => {
  try {
    const lenders = await User.find(
      { role: "lender" },
      "name email interestRate maxLoanAmount availableFunds"
    );
    res.json(lenders);
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Failed to fetch lenders" });
  }
});

router.put("/update-profile", async (req, res) => {
  const {
    email,
    name,
    phone,
    salary,
    interestRate,
    maxLoanAmount,
    availableFunds,
  } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });

  }

  try {
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({ error: "User not found" });

    }

    // Common fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Borrower-specific

    if (user.role === "borrower" && salary !== undefined) {

      user.salary = salary;
    }

    // Lender-specific

    if (user.role === "lender") {
      if (interestRate !== undefined) user.interestRate = interestRate;
      if (maxLoanAmount !== undefined) user.maxLoanAmount = maxLoanAmount;
      if (availableFunds !== undefined) user.availableFunds = availableFunds;
    }


    if (user.role === "borrower" && salary !== undefined) {
      user.salary = salary;
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/profile", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Missing email" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Reply if 'replyTo' message ID is passed
router.post("/send-message", async (req, res) => {
  const { from, to, subject, body, replyTo } = req.body;

  if (!from || !to || !body) {
    return res.status(400).json({ error: "Missing message data" });
  }

  try {
    if (replyTo) {
      // It's a reply to an existing message
      const parent = await Message.findById(replyTo);
      if (!parent)
        return res.status(404).json({ error: "Original message not found" });

      parent.replies.push({ from, body });
      await parent.save();

      return res.status(200).json({ message: "Reply added successfully" });
    } else {
      // New message
      const newMsg = new Message({ from, to, subject, body });
      await newMsg.save();
      res.status(200).json({ message: "Message sent successfully" });
    }
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/messages", async (req, res) => {
  const { participant } = req.query;

  if (!participant || participant.trim() === "") {
    return res.status(400).json({ error: "Missing or invalid 'participant'" });
  }

  try {
    const messages = await Message.find({
      $or: [{ from: participant }, { to: participant }],
    }).sort({ date: -1 });

    // No need to populate from a separate model!
    res.status(200).json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/send-reply", async (req, res) => {
  const { messageId, from, body } = req.body;

  if (!messageId || !from || !body) {
    return res.status(400).json({ error: "Missing reply data" });
  }

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    message.replies.push({ from, body, date: new Date() });
    await message.save();

    res.status(200).json({ message: "Reply added successfully" });
  } catch (err) {
    console.error("Reply error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
