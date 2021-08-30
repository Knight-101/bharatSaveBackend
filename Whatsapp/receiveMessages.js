const templates = require("./Templates");
const axios = require("axios").default;
const newUser1 = require("./newUser1");
const welcome = require("./welcome");
const mainMenu = require("./mainMenu");
var accounts = {};

exports.receiveMsg = async (req, res, next) => {
  console.log(req.body);
  res.sendStatus(200);

  if (req.body.messages) {
    if (!accounts[req.body.messages[0].from]) {
      const number = req.body.messages[0].from;
      accounts[number] = {
        mainBlock: "",
        subBlock: "",
        menuSection: "",
        menuAction: "",
      };
    }
    if (accounts[req.body.messages[0].from].mainBlock === "New Account") {
      newUser1.receiveMsg(req.body.messages[0], accounts);
    } else if (accounts[req.body.messages[0].from].mainBlock === "Main Menu") {
      mainMenu.receiveMsg(req.body.messages[0], accounts);
    } else if (accounts[req.body.messages[0].from].mainBlock === "Old User") {
      oldUser.receiveMsg(req.body.messages[0], accounts);
    } else {
      accounts[req.body.messages[0].from].mainBlock = "Welcome";
      welcome.receiveMsg(req.body.messages[0], accounts);
    }
  }
};
