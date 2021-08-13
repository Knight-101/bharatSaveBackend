const mongoose = require("mongoose");

const buySchema = new mongoose.Schema({
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
  taxes: {
    totalTaxAmount: { type: String },
    taxSplit: [
      {
        type: { type: String },
        taxPerc: { type: String },
        taxAmount: { type: String },
      },
    ],
  },
  invoiceNumber: { type: String },
});

module.exports = mongoose.model("Buy", buySchema);
