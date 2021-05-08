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
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = productSchema;
