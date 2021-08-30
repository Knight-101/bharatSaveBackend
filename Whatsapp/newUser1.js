const welcome = require("./welcome");
const sendMsgs = require("./sendMessages");
const templates = require("./Templates");
const axios = require("axios").default;
const { nanoid } = require("nanoid");

var users = {};

exports.receiveMsg = async (message, accounts) => {
  if (accounts[message.from].subBlock === "New User Message") {
    var text =
      "Hello, 👋 Welcom to Bharat Save. I am A/B, a representative of Bharat Save here on on your service.How Can I help you?";
    var downloadAppBtn = sendMsgs.makeButton(
      "Download the app",
      "Download the app"
    );
    var openAccBtn = sendMsgs.makeButton(
      "Open a new account",
      "Open a new account"
    );
    var aboutUsBtn = sendMsgs.makeButton(
      "Know more about us",
      "Know more about us"
    );
    var buttons = [downloadAppBtn, openAccBtn, aboutUsBtn];
    accounts[message.from].subBlock = "New User Choice";
    sendMsgs.sendInteractiveButtonMsg(message.from, buttons, text);
  } else if (accounts[message.from].subBlock === "New User Choice") {
    if (message.interactive) {
      if (message.interactive.button_reply.id === "Download the app") {
        const text = "https://bharatsave.com";
        accounts[message.from].mainBlock = "";
        sendMsgs.sendTextMsg(message.from, text);
      } else if (message.interactive.button_reply.id === "Open a new account") {
        accounts[message.from].subBlock = "New Name";
        this.receiveMsg(message, accounts);
      } else if (message.interactive.button_reply.id === "Know more about us") {
        const text = "About\nHello, we are bharatsave.";
        accounts[message.from].mainBlock = "";
        sendMsgs.sendTextMsg(message.from, text);
      }
    } else {
      accounts[message.from].subBlock = "New User Message";
      this.receiveMsg(message, accounts);
    }
  } else if (accounts[message.from].subBlock === "New Name") {
    users[message.from] = JSON.parse(JSON.stringify(templates.userData));
    var newName =
      "Definetely, lets get you started.\nCan you please tell me your full name so that I can get you a digital GOLD Locker? 🔒";
    sendMsgs.sendTextMsg(message.from, newName);
    accounts[message.from].subBlock = "Name Received";
  } else if (accounts[message.from].subBlock === "Name Received") {
    users[message.from].userName = message.text.body;
    var confirmName = `${users[message.from].userName} is that correct?`;
    var buttons = [
      sendMsgs.makeButton("Yes", "Yes"),
      sendMsgs.makeButton("No", "No"),
    ];
    console.log(buttons);
    sendMsgs.sendInteractiveButtonMsg(message.from, buttons, confirmName);
    accounts[message.from].subBlock = "Confirm Name";
  } else if (accounts[message.from].subBlock === "Confirm Name") {
    if (message.interactive.button_reply.id === "Yes") {
      var replyEmail = `Cool name, 😏\nCan you also type in your email ID ${
        users[message.from].userName
      }?`;
      sendMsgs.sendTextMsg(message.from, replyEmail);
      accounts[message.from].subBlock = "New Email";
    } else {
      var newName = "No Problem, What’s your correct full name?";
      sendMsgs.sendTextMsg(message.from, newName);
      accounts[message.from].subBlock = "Name Received";
    }
  } else if (accounts[message.from].subBlock === "New Email") {
    users[message.from].emailId = message.text.body;
    var confirmEmail = `${users[message.from].emailId} is that correct?`;
    var buttons = [
      sendMsgs.makeButton("Yes", "Yes"),
      sendMsgs.makeButton("No", "No"),
    ];
    sendMsgs.sendInteractiveButtonMsg(message.from, buttons, confirmEmail);
    accounts[message.from].subBlock = "Confirm Email";
  } else if (accounts[message.from].subBlock === "Confirm Email") {
    if (message.interactive.button_reply.id === "Yes") {
      var replyPincode = `Can you also type in your pincode ${
        users[message.from].userName
      }?`;
      sendMsgs.sendTextMsg(message.from, replyPincode);
      accounts[message.from].subBlock = "New Pincode";
    } else {
      var newEmail = "No Problem, What’s your correct email?";
      sendMsgs.sendTextMsg(message.from, newEmail);
      accounts[message.from].subBlock = "Confirm Email";
    }
  } else if (accounts[message.from].subBlock === "New Pincode") {
    users[message.from].userPincode = message.text.body;
    var confirmPincode = `${users[message.from].userPincode} is that correct?`;
    var buttons = [
      sendMsgs.makeButton("Yes", "Yes"),
      sendMsgs.makeButton("No", "No"),
    ];
    sendMsgs.sendInteractiveButtonMsg(message.from, buttons, confirmPincode);
    accounts[message.from].subBlock = "Confirm Pincode";
  } else if (accounts[message.from].subBlock === "Confirm Pincode") {
    if (message.interactive.button_reply.id === "Yes") {
      users[message.from].uniqueId = nanoid();
      users[message.from].mobileNumber = message.from.slice(2);
      await axios
        .post(
          `${process.env.BACKEND_URL}/augmont/createuser`,
          users[message.from]
        )
        .then((res) => {
          console.log(res.data);
          var replySuccess = "Account created successfully";
          sendMsgs.sendTextMsg(message.from, replySuccess);
          accounts[message.from].subBlock = "Main Menu";
          welcome.receiveMsg(message, accounts);
        })
        .catch((err) => {
          console.log(err);
          var replyError = "Sorry there was some error";
          sendMsgs.sendTextMsg(message.from, replyError);
          accounts[message.from].subBlock = "Welcome";
        });
    } else {
      var newPincode = "No Problem, What’s your correct pincode?";
      sendMsgs.sendTextMsg(message.from, newPincode);
      accounts[message.from].subBlock = "New Pincode";
    }
  }
};
