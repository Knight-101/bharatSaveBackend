const mongoose = require("mongoose");

const sellSchema = new mongoose.Schema({
  merchantId: { type: Number },
  quantity: { type: String },
  totalAmount: { type: String },
  preTaxAmount: { type: String },
  metalType: { type: String },
  rate: { type: String },
  uniqueId: { type: String },
  transactionId: { type: String },
  userName: { type: String },
  merchantTransactionId: { type: String },
  mobileNumber: { type: String },
  goldBalance: { type: String },
  silverBalance: { type: String },
  bankInfo: {
    accountName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
  },
});

module.exports = mongoose.model("Sell", sellSchema);
