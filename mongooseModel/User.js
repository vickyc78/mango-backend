let mongoose = require("mongoose");
var Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    index: true
  },
  mobile: {
    type: Number,
    unique: true
  },
  address: [
    {
      address: {
        type: String
      }
    }
  ]
});
