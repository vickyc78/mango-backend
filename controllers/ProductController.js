let ProductModel = require("../models/ProductModel");

module.exports = router => {
  router.post("/saveProduct", async (req, res, next) => {
    try {
      res.status(200).json(await ProductModel.saveProduct(req.body));
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/getOneProduct/:productId", async (req, res, next) => {
    try {
      res.status(200).json(await ProductModel.getOneProduct(req.params));
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.get("/getAllProduct", async (req, res, next) => {
    try {
      res.status(200).json(await ProductModel.getAllProduct(req.body));
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.post("/updateProduct", async (req, res, next) => {
    try {
      res.status(200).json(await ProductModel.updateProduct(req.body));
    } catch (err) {
      res.status(500).json(err);
    }
  });
};
