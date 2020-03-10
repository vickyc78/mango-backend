let orderSchema = require("../mongooseModel/Order");
let productSchema = require("../mongooseModel/Product");
let mongoose = require("mongoose");
let Order = mongoose.model("Order", orderSchema);
let Product = mongoose.model("Product", productSchema);

module.exports = {
  async saveOrder(data) {
    let singleProduct = data.product.map(p => {
    let singleProductData=await  Product.findOne({
        _id: p.productId
      });
      return singleProductData
      let orderData=data.product.push({productAmount:singleProduct.amount})
      data.totalOrderAmount+=(singleProduct.amount*data.product.dozen)
    });
  }
};
