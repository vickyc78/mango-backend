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
      } else if (loginUserData) {
        res.status(200).send(loginUserData);
      }
    } catch (error) {}
  });

  router.post("/getOneUser", async (req, res) => {
    try {
      let getOneUserData = await UserModel.getOneUser(req.body);
      console.log("getOneUserData getOneUserData", getOneUserData);
      if (getOneUserData == "No user found") {
        res.status(422).json(getOneUserData);
      } else if (getOneUserData) {
        res.status(200).send(getOneUserData);
      }
    } catch (error) {}
  });
  router.post("/createAdmin", async (req, res) => {
    try {
      let createAdminData = await UserModel.createAdmin(req.body);
      console.log("createAdminData createAdminData", createAdminData);
      if (createAdminData == "No user found") {
        res.status(422).json(createAdminData);
      } else if (createAdminData) {
        res.status(200).send(createAdminData);
      }
    } catch (error) {}
  });
  router.post("/loginAdmin", async (req, res) => {
    try {
      let loginAdminData = await UserModel.loginAdmin(req.body);
      console.log("loginAdminData loginAdminData", loginAdminData);
      if (loginAdminData == "No user found") {
        res.status(422).json(loginAdminData);
      } else if (loginAdminData) {
        res.status(200).send(loginAdminData);
      }
    } catch (error) {}
  });
  router.post("/getOneAdminDetail", async (req, res) => {
    try {
      req.body.userId = req.user._id;
      let getOneAdminDetailData = await UserModel.getOneAdminDetail(req.body);
      console.log(
        "getOneAdminDetailData getOneAdminDetailData",
        getOneAdminDetailData
      );
      if (getOneAdminDetailData == "No user found") {
        res.status(422).json(getOneAdminDetailData);
      } else if (getOneAdminDetailData) {
        res.status(200).send(getOneAdminDetailData);
      }
    } catch (error) {}
  });
};
