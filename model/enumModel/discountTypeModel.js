const mongoose = require("mongoose");

const discountTypeSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
          },
        name:{
            type:String,
            required:true,
        },
        short_name:{
            type:String,
            default:""
        },
        symbol:{
            type:String,
            default:""
        },
        active:{
            type:Boolean,
            default:true
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("discountType", discountTypeSchema);