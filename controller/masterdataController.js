const fs = require('fs');
const path = require('path');
const enumType =require("../typeMention/enumType");
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
  

exports.adminPanelMasterData = async (req, res) => { // it will send which are active
    try {
        const couponcategorydata=await couponCategoryModel.find({ active: true });
        const discounttypedata=await discountTypeModel.find({ active: true });
        const typeOfBookingdata=await typeOfBookingModel.find({ active: true });
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

exports.sendAllMasterDataToAdmin=async (req,res)=>{ // it will send all record either true or false
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
}

exports.getparticularEnum= async (req,res)=>{
  const {type}=req.params;
  const {id}=req.body;
  
  const Model = enumType[type];
  console.log(Model);
  if (!Model) {
    return res.status(400).send({ status: false, message: "Invalid model type" });
  }
  try {
    // Fetch the data using the dynamically selected model
    const data = await Model.findOneAndUpdate(
      { id: id },  // Use custom field 'id'
      req.body,     // The data to update
      { new: true } // Return the updated document
    );
    
    if (!data) {
      return res.status(404).send({ status: false, message: "Data not found for update" });
    }
    
    res.send({ status: true,message:"fetch successfully", data: { type: data } });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Error fetching data" });
  }
}

exports.addNewMasterData = async (req, res) => {
  const { type } = req.params;
  const Model = enumType[type];
  
  console.log(Model);

  if (!Model) {
    return res.status(400).send({ status: false, message: "Invalid model type" });
  }
  
  try {
    
    const recordCount = await Model.countDocuments();
    const data = await Model.create({ id: recordCount + 1, ...req.body });

    res.send({ status: true, message: "Added new master data record successfully", data: { type: data } });
  } catch (error) {
    console.error(error);
    
    res.status(500).send({ status: false, message: "Error creating data" });
  }
};
