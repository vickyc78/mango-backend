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

  router.post("/createUser", (req, res, next) => {
    UserModel.createUser(req.body, function(err, user) {
      if (err) {
        res.json({
          error: err
        });
      } else {
        res.send(user);
      }
    });
  });
};
