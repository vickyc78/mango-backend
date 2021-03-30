let OrderModel = require("../models/OrderModel");

module.exports = router => {
  router.post("/saveOrder", async (req, res, next) => {
    try {
      let saveOrderData = await OrderModel.saveOrder(req.body);
      console.log("saveOrderData", saveOrderData);
      if (
        saveOrderData == "Mobile number should be 10 digit" ||
        saveOrderData == "Order Not Placed SuccessFully" ||
        saveOrderData == "Address is required"
      ) {
        res.status(422).send(saveOrderData);
      } else if (saveOrderData == "Failed To Save User") {
        res.status(500).send("Something want wrong");
      } else if (
        saveOrderData == "Order Placed Successfully" ||
        saveOrderData
      ) {
        res.status(200).json(saveOrderData);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });

  router.get("/getAllOrder", async (req, res, next) => {
    try {
      res.status(200).json(await OrderModel.getAllOrder(req.body));
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/getOneOrder", async (req, res, next) => {
    try {
      res.status(200).json(await OrderModel.getOneOrder(req.body));
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.post("/acceptRejectOrderFromAdmin", async (req, res, next) => {
    try {
      res
        .status(200)
        .json(await OrderModel.acceptRejectOrderFromAdmin(req.body));
    } catch (err) {
      res.status(500).json(err);
    }
  });
};
