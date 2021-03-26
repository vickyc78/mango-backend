let orderSchema = require("../mongooseModel/Order");
let productSchema = require("../mongooseModel/Product");
let transactionSchema = require("../mongooseModel/Transaction");
let invoiceSchema = require("../mongooseModel/Invoice");
let userSchema = require("../mongooseModel/User");
let mongoose = require("mongoose");
let Order = mongoose.model("Order", orderSchema);
let Product = mongoose.model("Product", productSchema);
let Transacion = mongoose.model("Transaction", transactionSchema);
let Invoice = mongoose.model("Invoice", invoiceSchema);
let User = mongoose.model("User", userSchema);
let ProductModel = require("../models/ProductModel");
let _ = require("lodash");

module.exports = {
  async saveOrder(data) {
    try {
      console.log("saveOrder", data);
      let userExist = await User.findOne({
        mobile: data.mobile
      });
      console.log("userExist userExist", userExist);
      if (userExist) {
        data.userId = userExist._id;
      } else {
        let newUser = new User({ name: data.name, mobile: data.mobile });
        let saveUser = await newUser.save();
        if (saveUser && saveUser._id) {
          data.userId = saveUser._id;
        } else {
          return "Failed To Save User";
        }
      }

      let totalOrderAmount = 0;
      let singleProduct = await data.product.map(async p => {
        let singleProductData = await ProductModel.getOneProduct({
          productId: p._id
        });
        p.productAmount = p.dozen * singleProductData.amount;
        p.productId = p._id;
        totalOrderAmount += p.productAmount;
        console.log("JJJJJJJJJJJJ", p);
        return p;
      });
      data.product = await Promise.all(singleProduct);
      data.totalOrderAmount = totalOrderAmount;
      let newOrder = await new Order(data);
      let saveOrder = await newOrder.save();
      if (saveOrder) {
        // const transactionObj = {
        //   userId: data.userId,
        //   orderId: saveOrder._id,
        //   transactionAmount: saveOrder.totalOrderAmount
        // };
        // const newTransation = await new Transacion(transactionObj);
        // const saveTransaction = await newTransation.save();
        // if (saveTransaction) {
        // const invoiceObj = {
        //   userId: data.userId,
        //   orderId: saveOrder._id,
        //   transactionId: saveTransaction._id,
        //   invoiceAmount: saveOrder.totalOrderAmount
        // };
        // const newInvoice = await new Invoice(invoiceObj);
        // const saveInvoice = await newInvoice.save();
        return "Order Placed Successfully";
        // } else {
        //   throw { err: "Something want wrong" };
        // }
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
