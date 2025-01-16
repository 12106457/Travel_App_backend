const couponModel =require("../model/couponModel");
const UserCoupons =require("../model/userCouponModel")
const mongoose=require("mongoose");
exports.addCoupon = (req, res) => {
    couponModel
      .create(req.body)
      .then((data) => {
        if(data){
        res.status(200).send({
          status: true,
          message: "Added successfully",
          data: data, 
        });
      }else{
        res.status(404).send({
          status:false,
          message:"Something went wrong while add the coupon.",
        })
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

  exports.addUserCoupon=(req,res)=>{
    console.log(req.body);
    UserCoupons.create(req.body)
    .then((data)=>{
      if(data){
        res.status(200).send({
          status: true,
          message: "Added successfully",
          data: data, 
        });
      }else{
        res.status(404).send({
          status:false,
          message:"Something went wrong while add the coupon.",
        })
      }
    })
  }

  exports.getAllCoupons=(req,res)=>{
    couponModel.find()
    .then((data)=>{
      if(data){
        res.status(200).send({
          status:true,
          message:"fetch successful",
          data:data,
        })
      }else{
        res.status(200).send({
          status:false,
          message:"fetch failed",
        })
      }
    })
  }

  exports.getAllUserCoupons=(req,res)=>{
    UserCoupons.find()
    .then((data)=>{
      if(data){
        res.status(200).send({
          status:true,
          message:"fetch successful",
          data:data,
        })
      }else{
        res.status(200).send({
          status:false,
          message:"fetch failed",
        })
      }
    })
  }

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
  