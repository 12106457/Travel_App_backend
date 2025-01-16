const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    code: {
        type: String, // Allow duplicate codes
        required: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ["PERCENTAGE", "FLAT"],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Coupons", couponSchema);