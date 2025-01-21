const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  newPassword: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Otps", OtpSchema);
