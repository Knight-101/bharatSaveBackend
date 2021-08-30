const express = require("express");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const http = require("http");
const dotenv = require("dotenv");
const logger = require("morgan");
const augmontRoutes = require("./api/routes/augmontRoute");
const userRoutes = require("./api/routes/userRoute");
const receiveMsgs = require("./Whatsapp/receiveMessages");
const paytmRoutes = require("./api/routes/paytmRoute");

dotenv.config();

var options = {
  key: fs.readFileSync(process.env.PRIV_KEY),
  cert: fs.readFileSync(process.env.CERT),
  ca: fs.readFileSync(process.env.CHAIN),
};

// require db
require("./config/mongoose.js");

const app = express();

app.use(express.json());
app.use(logger("dev"));
//handled CORS
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Methods", "*");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});

// set up routes
app.use("/augmont", augmontRoutes);
app.use("/paytm", paytmRoutes);
app.use("/user", userRoutes);
app.use("/webhook", receiveMsgs.receiveMsg);

// var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);

httpsServer.listen(443);
