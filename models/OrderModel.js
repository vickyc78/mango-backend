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
      console.log("saveOrder", data.userId);
      if (
        (data.mobile.length && data.mobile.length < 10) ||
        data.mobile.length > 10 ||
        !/^\d{10}$/.test(data.mobile)
      ) {
        return "Mobile number should be 10 digit";
      }
      if (!data.address) {
        return "Address is required";
      }
      if (!data.userId) {
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
      data.orderAddress = data.address;
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
        return data.userId ? "Order Placed Successfully" : saveUser;
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
  },
  async acceptRejectOrderFromAdmin(data) {
    if (!data.status) {
      return "Status is required";
    }
    let findOneOrder = await Order.findOne({
      _id: data.orderId,
      status: "Pending"
    });
    if (!findOneOrder) {
      return "No Order Found";
    }
    if (data.status == "Pending") {
      return "Please send valid status";
    }
    if (data.status && data.status == "Rejected") {
      if (!data.rejectionReason) {
        return "Please provide rejection reason";
      }
    }
    let acceptRejectData = await Order.updateOne(
      {
        _id: data.orderId,
        status: "Pending"
      },
      data,
      {
        new: true
      }
    );
    if (!acceptRejectData.nModified) {
      return "Failed To Update";
    }
    let invoiceObj = {
      userId: findOneOrder.userId,
      orderId: findOneOrder._id,
      status: "Complete",
      invoiceAmount: findOneOrder.totalOrderAmount
    };
    let newInvoiceData = new Invoice(invoiceObj);
    let saveInvoiceData = await newInvoiceData.save();
    if (saveInvoiceData) {
      return saveInvoiceData;
    } else {
      return "Failed to save invoice";
    }
  }
};
