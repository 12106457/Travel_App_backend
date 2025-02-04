const mongoose = require("mongoose");


const busSchema = new mongoose.Schema({
    busNo: { 
      type: String, 
      unique: true, 
      required: true 
    },
    driverDetails:{
       type: mongoose.Schema.Types.ObjectId, 
       ref: 'BusDriver', 
       default:null,
    },
    route: { 
      type: String, 
      required: true 
    },
    source:{
      type: String,
      required:true,
    },
    destination:{
      type: String,
      required:true,
    },
    totalSeats: { 
      type: Number, 
      required: true 
    },
    seats: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'BusSeat'  
    }],
    departureTime: { 
      type: Date, 
      required: true 
    },
    arrivalTime: { 
      type: Date, 
      required: true 
    },
  });
  
  module.exports = mongoose.model('Bus', busSchema);