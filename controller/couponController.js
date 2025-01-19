const couponModel = require("../model/couponModel");
const UserCoupons = require("../model/userCouponModel");
const mongoose = require("mongoose");
exports.addCoupon = (req, res) => {
  couponModel
    .create(req.body)
    .then((data) => {
      if (data) {
        res.status(200).send({
          status: true,
          message: "Added successfully",
          data: data,
        });
      } else {
        res.status(404).send({
          status: false,
          message: "Something went wrong while add the coupon.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Something went wrong",
        error: err.message || err,
      });
    });
};

exports.updateCouponDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Coupon ID is required" });
    }

    const updatedCoupon = await couponModel.findByIdAndUpdate(
      { _id: id },
      updateData,
      { new: true, runValidators: true } // Options: return updated document and validate data
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon updated successfully",
      data: updatedCoupon,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the coupon",
      error: error.message,
    });
  }
};

exports.addUserCoupon = (req, res) => {
  console.log(req.body);
  UserCoupons.create(req.body).then((data) => {
    if (data) {
      res.status(200).send({
        status: true,
        message: "Added successfully",
        data: data,
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Something went wrong while add the coupon.",
      });
    }
  });
};

exports.getAllCoupons = (req, res) => {
  couponModel.find().then((data) => {
    if (data) {
      res.status(200).send({
        status: true,
        message: "fetch successful",
        data: data,
      });
    } else {
      res.status(200).send({
        status: false,
        message: "fetch failed",
      });
    }
  });
};

exports.getAllUserCoupons = (req, res) => {
  UserCoupons.find().then((data) => {
    if (data) {
      res.status(200).send({
        status: true,
        message: "fetch successful",
        data: data,
      });
    } else {
      res.status(200).send({
        status: false,
        message: "fetch failed",
      });
    }
  });
};

exports.getCouponsEachUser = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      status: false,
      message: "Invalid user ID format",
    });
  }

  UserCoupons.find({ userId: id })
    .populate("userId")
    .populate("couponId")
    .then((data) => {
      res.status(200).send({
        status: true,
        message: "Fetch successful",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Fetch failed",
        error: err.message,
      });
    });
};
