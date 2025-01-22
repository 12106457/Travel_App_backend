const fs = require('fs');
const path = require('path');

const couponCategoryModel=require("../model/enumModel/couponCategoryModel")
const discountTypeModel=require("../model/enumModel/discountTypeModel")
const typeOfBookingModel=require("../model/enumModel/typeOfBookingModel")

// Paths to the JSON files
const couponCategoryData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/enumData/adminpanel/couponCategory.json')));
const discountTypeData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/enumData/adminpanel/discountType.json')));
const typeOfBookingData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/enumData/adminpanel/typeOfBooking.json')));


async function handler() {
    try {
      couponCategoryModel
        .create(couponCategoryData.categories)
        .then((response) => {
          if (!response) {
            console.log("Something went wrong while saving coupon category data");
          }
        })
        .catch((err) => {
          console.log("Error while saving coupon category data:", err.message);
        });
  
      discountTypeModel
        .create(discountTypeData.discountType)
        .then((response) => {
          if (!response) {
            console.log("Something went wrong while saving discount type data");
          }
        })
        .catch((err) => {
          console.log("Error while saving discount type data:", err.message);
        });
  
      typeOfBookingModel
        .create(typeOfBookingData.bookingType)
        .then((response) => {
          if (!response) {
            console.log("Something went wrong while saving booking type data");
          }
        })
        .catch((err) => {
          console.log("Error while saving booking type data:", err.message);
        });
  
      
    } catch (error) {
      console.log("Unexpected error:", error.message);
      if (res) {
        res.status(500).json({
          status: false,
          message: "Error saving master data",
          error: error.message,
        });
      }
    }
  }
  
  handler();
  

exports.adminPanelMasterData = async (req, res) => {
    try {
        const couponcategorydata=await couponCategoryModel.find();
        const discounttypedata=await discountTypeModel.find();
        const typeOfBookingdata=await typeOfBookingModel.find();
        res.status(200).send({
            status: true,
            message: "Fetch master data successfully",
            data: {
                couponCategory: couponcategorydata,
                discountType: discounttypedata,
                typeOfBooking: typeOfBookingdata
            }
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Error fetching master data",
            error: error.message
        });
    }
};
