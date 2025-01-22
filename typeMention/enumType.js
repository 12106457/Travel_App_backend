const couponCategoryModel=require("../model/enumModel/couponCategoryModel")
const discountTypeModel=require("../model/enumModel/discountTypeModel")
const typeOfBookingModel=require("../model/enumModel/typeOfBookingModel")

const enumType = {
    couponCategory: couponCategoryModel,
    discountType: discountTypeModel,
    typeOfBooking: typeOfBookingModel
  };
  module.exports = enumType;