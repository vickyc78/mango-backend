let mongoose = require("mongoose");
var Schema = mongoose.Schema;

let orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  // orderName: {
  //   type: String
  // },
  status: {
    type: String,
    enum: ["Pending", "InProcess", "Delivered", "Completed", "Rejected"],
    default: "Pending"
  },
  // transactionId: {
  //   type: Schema.Types.ObjectId,
  //   index: true
  // },
  totalOrderAmount: {
    type: Number
  },
  product: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        index: true
      },
      dozen: {
        type: Number
      },
      productAmount: {
        type: Number
      }
    }
  ],
  order: {
    type: String,
    enum: ["Online", "Cash On Delivery"],
    default: "Cash On Delivery"
  },
  userOrderDescription: {
    type: String
  },
  orderAddress: {
    type: String
  },
  mobile: {
    type: String
  },
  rejectionReason: {
    type: String
  }
});

module.exports = orderSchema;
