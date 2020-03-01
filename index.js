let express = require("express");

let mongoose = require("mongoose");

let bodyParser = require("body-parser");

let Schema = mongoose.Schema;

let router = express.Router();
let app = express();

var env = require("./config/env/development");
console.log("UIGGGGGGGGGGGGGGG", env);
mongoose.connect(env.dbUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let port = process.env.PORT || env.port;
app.listen(port, function() {
  console.log(`App listing on port ${port} !`);
});

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
  );
  next();
});
app.get("/", function(req, res) {
  res.send("Hello Express");
});
