let userSchema = require("../mongooseModel/User");
let mongoose = require("mongoose");
let _ = require("lodash");
const SendOtp = require("sendotp");
const sendOtp = new SendOtp("291342An3Ppx33Wqa5d64ca9a");
const async = require("async");
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
  // async createUser(data, callback) {
  //   try {
  //     /**
  //      * To check whether user mobile number is register or not
  //      */
  //     let getData = await User.findOne({
  //       mobile: data.mobile
  //     });
  //     if (!_.isEmpty(getData)) {
  //       return "Mobile Number Is Already Register";
  //     }
  //     let saveUser = await new User(data);
  //     let newUser = await saveUser.save();
  //     console.log("newUser newUser", newUser);
  //     if (newUser) {
  //       let randomNumber = Math.floor(1000 + Math.random() * 999);
  //       console.log("randomNumber randomNumber", randomNumber);
  //       let sendOtpResponse = sendOtp.send(
  //         `91${data.mobile}`,
  //         "PRIIND",
  //         randomNumber,
  //         function(error, data) {
  //           console.log(data);
  //         }
  //       );
  //       console.log("sendOtpResponse", sendOtpResponse);
  //     }
  //   } catch (error) {
  //     return error;
  //   }
  // }

  createUser: (data, callback) => {
    console.log("FGhjk", data);
    let randomNumber;
    async.waterfall(
      [
        callback => {
          User.findOne({
            mobile: data.mobile
          }).exec((err, getData) => {
            console.log(getData);
            if (err) {
              callback(err);
            } else if (_.isEmpty(getData)) {
              callback(null, data);
            } else {
              callback(null, "User Already register");
            }
          });
        },
        (findOneData, callback) => {
          console.log("findOneData", findOneData);
          let saveUser = new User(data);
          saveUser.save((err, saveData) => {
            callback(err, saveData);
          });
        },
        (saveUserData, callback) => {
          if (saveUserData) {
            randomNumber = Math.floor(1000 + Math.random() * 999);
            console.log("randomNumber randomNumber", randomNumber);
            sendOtp.send(
              `91${saveUserData.mobile}`,
              "PRIIND",
              randomNumber,
              function(error, sendOtpData) {
                console.log(sendOtpData);
                if (sendOtpData.type == "success") {
                  callback(null, saveUserData);
                } else {
                  callback(err);
                }
              }
            );
          }
        },
        (saveUserData, callback) => {
          User.findOneAndUpdate(
            {
              _id: saveUserData._id,
              mobile: saveUserData.mobile
            },
            {
              $set: {
                otp: randomNumber,
                expiry: moment().add(1, "d")
              }
            },
            {
              new: true
            }
          ).exec((err, updatedUser) => {
            callback(err, updatedUser);
          });
        }
      ],
      callback
    );
  },

  async verifyOtp(data) {
    try {
      let otpData = await User.findOne({
        otp: data.otp
      });
      if (_.isEmpty(otpData)) {
        throw { err: "Otp does not match" };
      } else {
        return "Otp verify";
      }
    } catch (error) {
      throw error;
    }
  },

  loginUser: (data, callback) => {
    let randomNumber;
    async.waterfall(
      [
        callback => {
          User.findOne({
            mobile: data.mobile
          }).exec((err, userData) => {
            if (err) {
              callback(err);
            } else if (_.isEmpty(userData)) {
              callback("No User Found For This Mobile Number");
            } else {
              callback(null, userData);
            }
          });
        },
        (userData, callback) => {
          if (userData) {
            randomNumber = Math.floor(1000 + Math.random() * 999);
            console.log("randomNumber randomNumber", randomNumber);
            sendOtp.send(
              `91${userData.mobile}`,
              "PRIIND",
              randomNumber,
              function(error, sendOtpData) {
                console.log(sendOtpData);
                if (sendOtpData.type == "success") {
                  callback(null, userData);
                } else {
                  callback(err);
                }
              }
            );
          }
        },
        (userData, callback) => {
          User.findOneAndUpdate(
            {
              _id: userData._id,
              mobile: userData.mobile
            },
            {
              $set: {
                otp: randomNumber,
                expiry: moment().add(1, "d")
              }
            },
            {
              new: true
            }
          ).exec((err, updatedUser) => {
            callback(err, updatedUser);
          });
        }
      ],
      callback
    );
  }
};

// module.exports = user;
