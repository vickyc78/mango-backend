let UserModel = require("../models/UserModel");

module.exports = function(router) {
  //   router.post("/createUser", (req, res, next) => {
  //     // console.log("req.body req.body", req.body);
  //     UserModel.createUser(req.body, (err, saveResponse) => {
  //       //   console.log("saveResponse saveResponse", saveResponse);
  //       if (err) {
  //         res.status(200).json({ err: "Failed to Save" });
  //       } else {
  //         res.status(200).json(saveResponse);
  //       }
  //     });
  //   });
  // router.post("/createUser", async (req, res, next) => {
  //   try {
  //     res.status(200).json(await UserModel.createUser(req.body));
  //   } catch (err) {
  //     res.status(200).json(err);
  //   }
  // });

  //   router.post("/createUser", (req, res, next) => {
  //     console.log("createUsercreateUser", req.body);
  //     UserModel.createUser(req.body, function(err, user) {
  //       if (err) {
  //         res.json({
  //           error: err
  //         });
  //       } else {
  //         res.send(user);
  //       }
  //     });
  //   });

  //   router.get("/verifyOtp/:otp", async (req, res, next) => {
  //     try {
  //       res.status(200).json(await UserModel.verifyOtp(req.params));
  //     } catch (error) {
  //       res.status(500).json(error);
  //     }
  //   });

  //   router.get("/loginUser", (req, res, next) => {
  //     UserModel.loginUser(req.body, (err, login) => {
  //       if (err) {
  //         res.json({
  //           err: err
  //         });
  //       } else {
  //         res.json(login);
  //       }
  //     });
  //   });

  router.post("/registerUser", async (req, res) => {
    try {
      let saveUserData = await UserModel.registerUser(req.body);
      console.log("saveUserData saveUserData", saveUserData);
      if (
        saveUserData == "Mobile number is required" ||
        saveUserData == "Mobile number should be 10 digit"
      ) {
        res.status(400).send(saveUserData);
      } else if (saveUserData == "Something Want Wrong") {
        res.status(500).json(saveUserData);
      } else if (
        saveUserData ==
        "You are already register with us through this mobile number"
      ) {
        res.status(422).json(saveUserData);
      } else {
        res.status(200).send(saveUserData);
      }
    } catch (error) {}
  });

  router.post("/loginUser", async (req, res) => {
    try {
      let loginUserData = await UserModel.loginUser(req.body);
      console.log("loginUserData loginUserData", loginUserData);
      if (
        loginUserData ==
        "You are not register with us through this mobile number"
      ) {
        res.status(422).json(loginUserData);
      } else if (
        loginUserData == "Mobile number is required" ||
        loginUserData == "Mobile number should be 10 digit"
      ) {
        res.status(400).send(loginUserData);
      } else if (loginUserData == "User Exist") {
        res.status(200).send(loginUserData);
      }
    } catch (error) {}
  });
};
