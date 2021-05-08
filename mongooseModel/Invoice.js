let mongoose = require("mongoose");
var Schema = mongoose.Schema;

let invoiceSchema = new Schema({
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
    enum: ["Pending", "Complete", "Cancel"],
    default: "Pending"
  },
  // transactionId: {
  //   type: Schema.Types.ObjectId,
  //   index: true
  // },
  invoiceAmount: {
    type: Number
  }
});

module.exports = invoiceSchema;
