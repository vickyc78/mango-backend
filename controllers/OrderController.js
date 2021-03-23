let OrderModel = require("../models/OrderModel");

module.exports = router => {
  router.post("/saveOrder", async (req, res, next) => {
    try {
      res.status(200).json(await OrderModel.saveOrder(req.body));
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
};
