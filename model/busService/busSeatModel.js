const mongoose = require("mongoose");
const busSeatsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users', 
    default:null,
  },
  busId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bus',  
    required: true
  },
  seatNo: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: String, 
    required: true 
  },
  bookingStatus: { 
    type: Boolean, 
    default: false  
  },
});

module.exports = mongoose.model('BusSeat', busSeatsSchema);