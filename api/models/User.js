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
  userState: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  totalAmount: { type: String },
  goldBalance: { type: String },

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
  ],
  // Name: {
  //   type: String,
  //   required: true,
  // },
});

module.exports = mongoose.model("User", userSchema);
