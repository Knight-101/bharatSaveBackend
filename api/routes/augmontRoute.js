const express = require("express");
const router = express.Router();
const controller = require("../controllers/augmont.controller");

//create user
router.post("/createuser", controller.createUser);
//create user
router.post("/login", controller.login);
//POST create user bank request
router.post("/userbankcreate", controller.bankCreate);
//GET gold rate(incl. tax)
router.get("/goldrate", controller.goldRate);
//POST buy request
router.post("/buy", controller.buyGold);
//get buy list
router.get("/buylist", controller.buyList);
//POST sell request
router.post("/sell", controller.sellGold);
//get sell list
router.get("/selllist", controller.sellList);
// check if authenticated
router.get("/isAuth", controller.isAuth);

module.exports = router;
