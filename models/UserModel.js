let userSchema = require("../mongooseModel/User");
let mongoose = require("mongoose");
let _ = require("lodash");
const SendOtp = require("sendotp");
const sendOtp = new SendOtp("291342An3Ppx33Wqa5d64ca9a");
const async = require("async");
//Register Schema to User
const User = mongoose.model("User", userSchema);

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET_CRYPTO;

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
              callback("User Already register");
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
                expiry: new Date() + 1
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

  // loginUser: (data, callback) => {
  //   let randomNumber;
  //   async.waterfall(
  //     [
  //       callback => {
  //         User.findOne({
  //           mobile: data.mobile
  //         }).exec((err, userData) => {
  //           if (err) {
  //             callback(err);
  //           } else if (_.isEmpty(userData)) {
  //             callback("No User Found For This Mobile Number");
  //           } else {
  //             callback(null, userData);
  //           }
  //         });
  //       },
  //       (userData, callback) => {
  //         if (userData) {
  //           randomNumber = Math.floor(1000 + Math.random() * 999);
  //           console.log("randomNumber randomNumber", randomNumber);
  //           sendOtp.send(
  //             `91${userData.mobile}`,
  //             "PRIIND",
  //             randomNumber,
  //             function(error, sendOtpData) {
  //               console.log(sendOtpData);
  //               if (sendOtpData.type == "success") {
  //                 callback(null, userData);
  //               } else {
  //                 callback(err);
  //               }
  //             }
  //           );
  //         }
  //       },
  //       (userData, callback) => {
  //         User.findOneAndUpdate(
  //           {
  //             _id: userData._id,
  //             mobile: userData.mobile
  //           },
  //           {
  //             $set: {
  //               otp: randomNumber,
  //               expiry: moment().add(1, "d")
  //             }
  //           },
  //           {
  //             new: true
  //           }
  //         ).exec((err, updatedUser) => {
  //           callback(err, updatedUser);
  //         });
  //       }
  //     ],
  //     callback
  //   );
  // },
  async registerUser(data) {
    console.log("SERFGUHJok", /^\d{10}$/.test(data.mobile));
    if (!data.mobile) {
      return "Mobile number is required";
    } else if (
      (data.mobile.length && data.mobile.length < 10) ||
      data.mobile.length > 10 ||
      !/^\d{10}$/.test(data.mobile)
    ) {
      return "Mobile number should be 10 digit";
    }

    let findOneUser = await User.findOne({
      mobile: data.mobile
    });
    if (findOneUser) {
      return "You are already register with us through this mobile number";
    } else {
      let newUser = new User(data);
      let saveUser = await newUser.save(newUser);
      if (!saveUser) {
        return "Something Want Wrong";
      } else {
        return saveUser;
      }
    }
  },
  async loginUser(data) {
    if (!data.mobile) {
      return "Mobile number is required";
    } else if (
      (data.mobile.length && data.mobile.length < 10) ||
      data.mobile.length > 10
    ) {
      return "Mobile number should be 10 digit";
    }
    let findOneUser = await User.findOne({
      mobile: data.mobile
    });
    if (findOneUser) {
      return findOneUser;
    } else {
      return "You are not register with us through this mobile number";
    }
  },
  async getOneUser(data) {
    let findOneUser = await User.findOne({
      _id: data.userId
    });
    if (findOneUser) {
      return findOneUser;
    } else {
      return "No user found";
    }
  },

  async createAdmin(data) {
    let newUser = new User(data);
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(data.password, salt);
    console.log("newUser newUser", newUser);
    newUser.accessToken = jwt.sign(
      { secretPassword: newUser.password },
      process.env.TOKEN_SECRET_CRYPTO,
      {
        expiresIn: "1d"
      }
    );
    console.log("token token", newUser);
    let saveUser = await newUser.save();
    console.log("saveUser", saveUser);
    if (saveUser) {
      return saveUser;
    } else {
      return "Something went wrong while create admin";
    }
  },
  async loginAdmin(data) {
    let getOneUser = await User.findOne({
      email: data.email
    });
    console.log("getOneUser", getOneUser);
    if (!getOneUser) {
      return "No User Found For this email";
    }
    let checkPassword = await bcrypt.compare(
      data.password,
      getOneUser.password
    );
    console.log("checkPassword", checkPassword);
    if (checkPassword) {
      let token = jwt.sign(
        { secretPassword: getOneUser.password },
        process.env.TOKEN_SECRET_CRYPTO,
        {
          expiresIn: "1d"
        }
      );
      console.log("token token", token);
      let updateUser = await User.updateOne(
        {
          _id: mongoose.Types.ObjectId(getOneUser._id),
          email: data.email
        },
        {
          $set: {
            accessToken: token
          }
        },
        {
          new: true
        }
      );
      if (updateUser && updateUser.modifiedCount) {
        return {
          email: getOneUser.email,
          accessToken: token,
          name: getOneUser.name
        };
      } else {
        return "Failed to update user";
      }
    } else {
      return "Password is wrong";
    }
  },
  async getOneAdminDetail(data) {
    console.log("ytguyhijk", data);
    let findOneAdmin = await User.findOne({
      _id: mongoose.Types.ObjectId(data.userId),
      accessLevel: "Admin"
    });
    console.log("findOneAdmin", findOneAdmin);
    if (findOneAdmin) {
      return findOneAdmin;
    } else {
      return "No User Found";
    }
  }
};

// module.exports = user;
