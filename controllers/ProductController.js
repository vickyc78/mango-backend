let ProductModel = require("../models/ProductModel");

module.exports = router => {
  router.post("/saveProduct", async (req, res, next) => {
    try {
      res.status(200).json(await ProductModel.saveProduct(req.body));
    } catch (err) {
      res.status(500).json(err);
    }
  });
};
