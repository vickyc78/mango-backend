let ProductModel = require("../models/ProductModel");

module.exports = router => {
  router.post("/saveProduct", async (req, res, next) => {
    try {
      res.status(200).json(await ProductModel.saveProduct(req.body));
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/getOneProduct", async (req, res, next) => {
    try {
      res.status(200).json(await ProductModel.getOneProduct(req.body));
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/getAllProduct", async (req, res, next) => {
    try {
      res.status(200).json(await OrderModel.getAllProduct(req.body));
    } catch (err) {
      res.status(500).json(err);
    }
  });
};
