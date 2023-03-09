let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let productSchema = new Schema(
  {
    name: {
      type: String
    },
    amount: {
      type: Number
    },
    description: {
      type: String
    },
    image:{
      type:String
    },
    fileName:{
      type:String
    },
    enable:{
      type:Boolean,
      enum:[1,0],
      default:1
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = productSchema;
