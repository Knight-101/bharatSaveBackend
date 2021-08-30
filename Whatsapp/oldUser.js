const sendMsgs = require("./sendMessages");
const templates = require("./Templates");
const mainMenu = require("./mainMenu");
const axios = require("axios").default;

exports.receiveMsg = (message, accounts) => {
  accounts[message.from].mainBlock = "Main Menu";
  accounts[message.from].subBlock = "Main Menu";
  mainMenu.receiveMsg(message, accounts);
};
