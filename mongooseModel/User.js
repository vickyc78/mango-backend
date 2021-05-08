let mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;

let userSchema = new Schema(
  {
    name: {
      type: String,
      index: true
    },
    mobile: {
      type: String
      // unique: true
    },
    address: [
      {
        address: {
          type: String
        }
      }
    ],
    accessLevel: {
      type: String,
      enum: ["User", "Admin"],
      default: "User"
    },
    accessToken: {
      type: String
    },
    password: {
      type: String
    },
    email: {
      type: String
    },
    otp: {
      type: Number,
      expiry: {
        type: Date
      }
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
// userSchema.post("save", async function(next) {
//   try {
//     console.log("this.password this.password", this.password);
//     let salt = await bcrypt.genSalt(12); // generate hash salt of 12 rounds
//     let hashedPassword = await bcrypt.hash(this.password, salt); // hash the current user's password
//     console.log("hashedPassword", hashedPassword);
//     this.password = hashedPassword;
//   } catch (error) {
//     console.error(error);
//   }
//   return next();
// });
module.exports = userSchema;
