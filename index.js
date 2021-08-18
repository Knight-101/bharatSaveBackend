const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("morgan");
const augmontRoutes = require("./api/routes/augmontRoute");
const userRoutes = require("./api/routes/userRoute");

dotenv.config();

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
app.use("/user", userRoutes);

//server listening on port
app.listen(process.env.PORT || 80, function () {
  console.log("server started on port 80");
});
