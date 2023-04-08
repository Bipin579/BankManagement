const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: true },
    initialBalance: { type: Number, required: true },
    aadharNo: { type: Number, required: true },
    panNo: { type: String, required: true },
    amount: { type: Number},
  },
  {
    timestamps: true,
  }
);

let BankModel = mongoose.model("bankuser", userSchema);

module.exports = BankModel;
