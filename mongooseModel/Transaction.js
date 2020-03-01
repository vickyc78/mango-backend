let mongoose = require("mongoose");
var Schema = mongoose.Schema;

let orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  status: {
    type: String,
    enum: ["pending", "inComplete", "complete"],
    default: pending
  },
  rozerPayId: {
    type: String
  },
  responseOfRozer: {
    type: String
  }
});
