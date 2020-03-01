let mongoose = require("mongoose");
var Schema = mongoose.Schema;

let orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  orderName: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "inProcess", "delivered", "completed"],
    default: pending
  },
  transactionId: {
    type: Schema.Types.ObjectId,
    index: true
  }
});
