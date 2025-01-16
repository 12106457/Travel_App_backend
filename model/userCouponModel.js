const mongoose = require("mongoose");

const UserCouponsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupons",
        required: true,
    },
    minOrderValue: {
        type: Number,
        default: 0,
    },
    maxDiscount: {
        type: Number,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
        default: () => {
            const now = new Date();
            now.setDate(now.getDate() + 15);
            return now;
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model("UserCoupons", UserCouponsSchema);