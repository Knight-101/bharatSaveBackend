const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userPincode: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  totalAmount: { type: String },
  goldBalance: { type: String },
  activePlans: [
    {
      subscriptionId: {
        type: String,
        required: true
      },
      planName: {
        type: String,
        enum: ["Round Up", "Daily Savings", "Weekly Savings", "Monthly Savings"],
        required: true,
        unique: true
      },
      active: {
        type: Boolean,
        default: false
      }
    }
  ],
  userBanks: [
    {
      userBankId: { type: String },
      uniqueId: { type: String },
      bankId: { type: String },
      bankName: { type: String },
      accountNumber: { type: String },
      accountName: { type: String },
      ifscCode: { type: String },
      status: { type: String },
    },
  ]
});

module.exports = mongoose.model("User", userSchema);
