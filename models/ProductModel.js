let ProductSchema = require("../mongooseModel/Product");
let mongoose = require("mongoose");
let Product = mongoose.model("Product", ProductSchema);

module.exports = {
  async saveProduct(data) {
    let productData = await new Product(data);
    let newProduct = await productData.save();
    return newProduct;
  }
};
