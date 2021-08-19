const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const fs = require("fs")
const https = require("https")
const http = require("http")
const dotenv = require("dotenv");
const augmontRoutes = require("./api/routes/augmontRoute");

dotenv.config();

var options = {
  key: fs.readFileSync(process.env.PRIV_KEY),
  cert: fs.readFileSync(process.env.CERT),
  ca: fs.readFileSync(process.env.CHAIN)
};

// require db
require("./config/mongoose.js");

const app = express();

app.use(bodyParser.json());
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


// var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);

httpsServer.listen(443);
