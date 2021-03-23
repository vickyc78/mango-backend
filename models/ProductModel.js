let ProductSchema = require("../mongooseModel/Product");
let mongoose = require("mongoose");
let Product = mongoose.model("Product", ProductSchema);
let _ = require("lodash");

module.exports = {
  async saveProduct(data) {
    let productData = await new Product(data);
    let newProduct = await productData.save();
    return newProduct;
  },
  async getOneProduct(data) {
    try {
      let productDetail = await Product.findOne({
        _id: data.productId
      });
      if (_.isEmpty(productDetail)) {
        throw { err: "No Product Found" };
      } else {
        return productDetail;
      }
    } catch (error) {
      throw error;
    }
  },
  async getAllProduct(data) {
    try {
      let productDetail = await Product.find({});
      if (_.isEmpty(productDetail)) {
        throw { err: "No Product Found" };
      } else {
        return productDetail;
      }
    } catch (error) {
      throw error;
    }
  }
};
