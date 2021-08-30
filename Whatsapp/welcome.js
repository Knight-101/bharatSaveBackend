const templates = require("./Templates");
const axios = require("axios").default;
const newUser1 = require("./newUser1");
const oldUser = require("./oldUser");
const User = require("../api/models/User");

exports.receiveMsg = async (message, accounts) => {
  await User.findOne(
    { mobileNumber: message.from.slice(2) },
    async (err, foundUser) => {
      if (foundUser) {
        accounts[message.from].mainBlock = "Old User";
        accounts[message.from].subBlock = "Main Menu";
        accounts[message.from] = foundUser;
        oldUser.receiveMsg(message, accounts);
      } else {
        accounts[message.from].mainBlock = "New Account";
        accounts[message.from].subBlock = "New User Message";
        newUser1.receiveMsg(message, accounts);
      }
    }
  );
};
