/*
AIM: To create a basic FREE App to install on a shopify store wtih JWT authentication and with webhooks set for both shop/update and app/uninstalled. 

Basic overview of the app:
Database - MongoDB (You can also use MongoDB atlas)
Authentication - Shopify JWT

How to get started:
1. run "npm install" to install dependencies
2. update the environment variables on the .env file.
3. start a node server (npm run dev) and a ngrok instance 
4. update app urls (main and callbacks) on the partner dashboard.
  on main url use https://{hostname}/auth
  on callbacks use https://{hostname}/auth/callback
5. Install the app on a development store from your partner dashboard.

NOTE: For webhook to work according to this server.js, you need to setup the webhok url in evironment file to 
https://{{hostname}}/webhooks

*/

const express = require("express");
const nextapp = require("next");
const server = express();
const bodyParser = require("body-parser");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = nextapp({ dev });
const handle = app.getRequestHandler();
const cors = require("cors");
require("./config");

const popup = require("./models/popup");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set("useFindAndModify", false);
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  urlEndpoint: "https://ik.imagekit.io/arokee123",
  publicKey: "public_l3XCrmtwvPynDFWM7UQtkjp7Mkk=",
  privateKey: "private_wy6UYms9EXJQZYow73qFvQW8RkM=",
});

// allow cross-origin requests
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

server.get("/imagekitauth", function (req, res) {
  let result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// mongoose.connect(
//   MONGODB_URI,
//   function (err, db) {
//     if (err) throw err;
//     db.createCollection(popup, function (err, resp) {
//       if (err) throw err;
//       console.log("Collection created!");
//     });
//   },
//   { useNewUrlParser: true, useUnifiedTopology: true }
// );

// const connection = mongoose.connection;

// connection.once('open', function () {
//   console.log("MongoDB database connection established successfully");
// });

//init routes
const authRoutes = require("./routers/auth");
const apiRoutes = require("./routers/api");
const webhookRoutes = require("./routers/webhook/shop_data_request");

server.use(cors());

//Serve static assets without auth
server.get("/_next/*", (req, res) => {
  return handle(req, res);
});

//Authentication Url
server.use("/auth", authRoutes);

//Api Url
server.use("/api", bodyParser.json(), apiRoutes);

//Webhook Url
server.use(
  "/webhooks",
  bodyParser.raw({ type: "application/json" }),
  webhookRoutes
);

// Middleware for checking if shop param is present for all app page requests
const checkShop = require("./middleware/checkShop");

server.get("*", checkShop, (req, res) => {
  return handle(req, res);
});

app
  .prepare()
  .then(() => {
    server.listen(port, () => {
      console.log(`Shopify app listening at http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
