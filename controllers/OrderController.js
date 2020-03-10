let OrderModel = require("../models/OrderModel");

module.exports = router => {
  router.post("/saveOrder", async (req, res, next) => {
    try {
      res.status(200).json(await OrderModel.saveOrder(req.body));
    } catch (error) {
      res.status(500).json(error);
    }
  });
};
