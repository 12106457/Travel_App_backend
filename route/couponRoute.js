const express = require("express");
const router = express.Router();
const couponController = require("../controller/couponController");

//coupon routes

router.post("/addNewCoupon", couponController.addCoupon);

router.get("/getAllCoupons", couponController.getAllCoupons);

router.post("/addCouponToUser", couponController.addUserCoupon);

router.get("/getAllUserCoupons", couponController.getAllUserCoupons);

router.get("/getCouponsEachUser/:id", couponController.getCouponsEachUser);

module.exports = router;
