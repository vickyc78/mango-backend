let orderSchema = require("../mongooseModel/Order");
let productSchema = require("../mongooseModel/Product");
let transactionSchema = require("../mongooseModel/Transaction");
let invoiceSchema = require("../mongooseModel/Invoice");
let mongoose = require("mongoose");
let Order = mongoose.model("Order", orderSchema);
let Product = mongoose.model("Product", productSchema);
let Transacion = mongoose.model("Transaction", transactionSchema);
let Invoice = mongoose.model("Invoice", invoiceSchema);
let ProductModel = require("../models/ProductModel");
let _ = require("lodash");

module.exports = {
  async saveOrder(data) {
    try {
      let totalOrderAmount = 0;
      let singleProduct = await data.product.map(async p => {
        let singleProductData = await ProductModel.getOneProduct(p);
        p.productAmount = p.dozen * singleProductData.amount;
        totalOrderAmount += p.productAmount;
        return p;
      });
      data.product = await Promise.all(singleProduct);
      data.totalOrderAmount = totalOrderAmount;
      let newOrder = await new Order(data);
      let saveOrder = await newOrder.save();
      if (saveOrder) {
        const transactionObj = {
          userId: data.userId,
          orderId: saveOrder._id,
          transactionAmount: saveOrder.totalOrderAmount
        };
        const newTransation = await new Transacion(transactionObj);
        const saveTransaction = await newTransation.save();
        if (saveTransaction) {
          const invoiceObj = {
            userId: data.userId,
            orderId: saveOrder._id,
            transactionId: saveTransaction._id,
            invoiceAmount: saveOrder.totalOrderAmount
          };
          const newInvoice = await new Invoice(invoiceObj);
          const saveInvoice = await newInvoice.save();
          return "Order Placed Successfully";
        } else {
          throw { err: "Something want wrong" };
        }
      } else {
        throw { err: "Order Not Placed SuccessFully" };
      }
    } catch (error) {
      throw error;
    }
  },

  async getAllOrder(data) {
    try {
      let orderDetail = await Order.find({
        userId: data.userId
      });
      if (_.isEmpty(orderDetail)) {
        throw { err: "No Order Found" };
      } else {
        return orderDetail;
      }
    } catch (error) {
      throw error;
    }
  },

  async getOneOrder(data) {
    try {
      let orderDetail = await Order.findOne({
        userId: data.userId,
        _id: data.orderId
      });
      if (_.isEmpty(orderDetail)) {
        throw { err: "No Order Found" };
      } else {
        return orderDetail;
      }
    } catch (error) {
      throw error;
    }
  }
};
