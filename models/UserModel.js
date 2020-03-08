let userSchema = require("../mongooseModel/User");
let mongoose = require("mongoose");
let _ = require("lodash");
const SendOtp = require("sendotp");
const sendOtp = new SendOtp("291342An3Ppx33Wqa5d64ca9a");
//Register Schema to User
const User = mongoose.model("User", userSchema);

module.exports = {
  //   createUser: (data, callback) => {
  //     // console.log("dgfchgjhbkjkl", data);

  //     let saveUser = new User(data);

  //     // console.log("saveUser saveUser", saveUser);

  //     saveUser.save((err, saveData) => {
  //       //   console.log("after save", err, saveData);

  //       callback(null, saveData);
  //     });
  //   }

  async createUser(data, callback) {
    try {
      let getData = await User.findOne({
        mobile: data.mobile
      });
      if (!_.isEmpty(getData)) {
        return "Mobile Number Is Already Register";
      }

      let saveUser = new User(data);
      let newUser = saveUser.save();
      if (newUser) {
        let randomNumber = Math.floor(1000 + Math.random() * 9999);
        console.log("randomNumber randomNumber", randomNumber);
        let sendOtpResponse = sendOtp.send(
          data.mobile,
          "PRIIND",
          randomNumber,
          function(error, data) {
            console.log(data);
          }
        );
      }
    } catch (error) {
      return error;
    }
  }
};

// module.exports = user;
