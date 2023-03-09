let ProductSchema = require("../mongooseModel/Product");
let mongoose = require("mongoose");
let Product = mongoose.model("Product", ProductSchema);
let _ = require("lodash");
var admin = require("firebase-admin");
const { Storage } = require('@google-cloud/storage');
var serviceAccount = require(`../${process.env.SESSION_PATH}`);
const storage = new Storage({ projectId: process.env.PROJECT_ID, keyFilename: serviceAccount });
storage.bucket(process.env.BUCKET_NAME);
const stream = require('stream');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.ADMIN_BUCKET
});

var bucket = admin.storage().bucket();

module.exports = {
  async saveProduct(data) {
    let newProduct ={}
    data.enable=data.enable?1:0
    console.log("save produtct", data)
    const image = data.fileContent
    const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1]
    console.log("mimeType", mimeType)
    const fileName = data.fileName
    const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '')
    console.log("base64EncodedImageString", base64EncodedImageString)
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');
    console.log("imageBuffer", imageBuffer)
    const bufferStream = new stream.PassThrough();
    bufferStream.end(imageBuffer);
    const file = bucket.file('images/' + fileName);
   bufferStream.pipe(file.createWriteStream({
      metadata: {
        contentType: mimeType
      },
      public: true,
      validation: "md5"
    }))
      .on('error', function (err) {
        console.log('error from image upload', err);
      })
      .on('finish',async function () {
        // The file upload is complete.
        await file.getSignedUrl({
          action: 'read',
          expires: '03-09-2491'
        }).then(async signedUrls => {
          // signedUrls[0] contains the file's public URL
          data.image = signedUrls[0]
    let productData = await new Product(data);
     newProduct = await productData.save();
    
        });
      });
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
      let productDetail = await Product.find({enable:1}).sort({ _id: -1 });
      if (_.isEmpty(productDetail)) {
        throw { err: "No Product Found" };
      } else {
        return productDetail;
      }
    } catch (error) {
      throw error;
    }
  },
  async getAllProductByAdmin(data) {
    try {
      let productDetail = await Product.find({}).sort({ _id: -1 });
      if (_.isEmpty(productDetail)) {
        throw { err: "No Product Found" };
      } else {
        return productDetail;
      }
    } catch (error) {
      throw error;
    }
  },
  async updateProduct(data) {
    try {
      let updateProduct ={}
      data.enable=data.enable?1:0
    console.log("updateProduct produtct", data)
  //   const image = data.fileContent
  //   const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1]
  //   console.log("mimeType", mimeType)
  //   const fileName = data.fileName
  //   const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '')
  //   console.log("base64EncodedImageString", base64EncodedImageString)
  //   const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');
  //   console.log("imageBuffer", imageBuffer)
  //   const bufferStream = new stream.PassThrough();
  //   bufferStream.end(imageBuffer);
  //   const file = bucket.file('images/' + fileName);
  //   console.log("befor image upload")
  //  let imageUrl=new Promise (bufferStream.pipe(file.createWriteStream({
  //     metadata: {
  //       contentType: mimeType
  //     },
  //     public: true,
  //     validation: "md5"
  //   }))
  //     .on('error', function (err) {
  //       console.log('error from image upload', err);
  //     })
  //     .on('finish',async function () {
  //       // The file upload is complete.
  //       await file.getSignedUrl({
  //         action: 'read',
  //         expires: '03-09-2491'
  //       }).then(async signedUrls => {
  //         // signedUrls[0] contains the file's public URL
  //         return signedUrls[0]
  //         data.image = signedUrls[0]
  //         updateProduct = await Product.updateOne(
  //           { _id: data.productId },
  //           data,
  //           { new: true }
  //         );
    
  //       });
  //     }));
  //      console.log("updateProduct imageUrl",imageUrl,updateProduct)
  //      return updateProduct
      // if (_.isEmpty(updateProduct)) {
      //   throw { err: "No Product Found" };
      // } else {
      //   return updateProduct;
      // }
      updateProduct = await Product.updateOne(
                  { _id: data.productId },
                  data,
                  { new: true }
                );
                return updateProduct;
      
    } catch (error) {
      throw error;
    }
  }
};
