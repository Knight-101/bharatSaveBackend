const sendMsgs = require("./sendMessages");
const User = require("../api/models/User");
const FormData = require("form-data");
const augCtrl = require("../api/controllers/augmont.controller");
const templates = require("./Templates");
const axios = require("axios").default;
const { nanoid } = require("nanoid");
const Buy = require("../api/models/Buy");

exports.receiveMsg = async (message, accounts) => {
  if (accounts[message.from].subBlock === "Main Menu") {
    accounts[message.from].meunuAction = "Made Choice";
    accounts[message.from].subBlock = "Made Choice";
    sendMsgs.sendMsg(makeMainMenu(message, accounts));
  } else if (accounts[message.from].meunuAction === "Made Choice") {
    if (message.type === "interactive") {
      if (message.interactive.list_reply) {
        if (message.interactive.list_reply.id === "Buy Gold") {
          var data = await getCurrentGoldRate();
          var text = `Current gold price is ${data.totalBuyPrice}/g\nIn which form would you like to buy?`;
          var grambutton = sendMsgs.makeButton("gram", "gram");
          var rupeebutton = sendMsgs.makeButton("Money", "Money");
          var buttons = [grambutton, rupeebutton];
          accounts[message.from].subBlock = "Buy Choice";
          accounts[message.from].menuSection = "Buy Gold";
          sendMsgs.sendInteractiveButtonMsg(message.from, buttons, text);
        } else if (message.interactive.list_reply.id === "Sell Gold") {
          var text = `Current sell price is ${
            getCurrentGoldRate().totalSellPrice
          }/g\nIn which form would you like to sell?`;
          var grambutton = sendMsgs.makeButton("gram", "gram");
          var rupeebutton = sendMsgs.makeButton("Money", "Money");
          var buttons = [grambutton, rupeebutton];
          accounts[message.from].subBlock = "Sell Choice";
          sendMsgs.sendInteractiveButtonMsg(message.from, buttons, text);
        } else if (message.interactive.list_reply.id === "Gift Gold") {
          var text = `Current buy price is ${
            getCurrentGoldRate().totalBuyPrice
          }/g\nIn which form would you like to gift?`;
          var grambutton = sendMsgs.makeButton("gram", "gram");
          var rupeebutton = sendMsgs.makeButton("Money", "Money");
          var buttons = [grambutton, rupeebutton];
          accounts[message.from].subBlock = "Gift Choice";
          sendMsgs.sendInteractiveButtonMsg(message.from, buttons, text);
        } else if (message.interactive.list_reply.id === "Current Price") {
        } else if (message.interactive.list_reply.id === "Locker") {
        } else if (message.interactive.list_reply.id === "Change Profile") {
        } else if (
          message.interactive.list_reply.id === "Recent Transactions"
        ) {
        } else if (message.interactive.list_reply.id === "Contact Us") {
        } else if (message.interactive.list_reply.id === "FeedBack") {
        }
      } else if (message.interactive.button_reply) {
        if (accounts[message.from].subBlock === "Buy Choice") {
          if (message.interactive.button_reply.id === "gram") {
            var text = "Type weight of gold to buy (in grams). ";
            accounts[message.from].subBlock = "Buy gram";
            sendMsgs.sendTextMsg(message.from, text);
          } else if (message.interactive.button_reply.id === "Money") {
            var text = "Type amount of gold to buy (in rupees). ";
            accounts[message.from].subBlock = "Buy money";
            sendMsgs.sendTextMsg(message.from, text);
          }
        }
      }
    } else {
      if (accounts[message.from].menuSection === "Buy Gold") {
        if (accounts[message.from].subBlock === "Buy money") {
          var data = await getCurrentGoldRate();
          const amount = message.text.body;
          buyGold(
            data.buyPrice,
            amount,
            accounts[message.from]._id,
            data.blockId
          );
          accounts[message.from].mainBlock = "";
        } else if (accounts[message.from].subBlock === "Buy gram") {
          var data = await getCurrentGoldRate();
          const amount = (data.totalPrice * message.text.body).toFixed(2);
          buyGold(
            data.buyPrice,
            amount,
            accounts[message.from]._id,
            data.blockId
          );
        }
      } else {
        accounts[message.from].subBlock = "Main Menu";
        this.receiveMsg(message, accounts);
      }
    }
  }
};

const makeMainMenu = (message, accounts) => {
  var rowBuyGold = sendMsgs.makeRow("Buy Gold", "Buy Gold", "to buy gold");
  var rowSellGold = sendMsgs.makeRow(
    "Sell Gold",
    "Sell Gold",
    "to sell your current gold"
  );
  var rowGiftGold = sendMsgs.makeRow("Gift Gold", "Gift Gold", "to gift gold");
  var rowCurrentGoldRate = sendMsgs.makeRow(
    "Current Price",
    "Current Price",
    "to get current gold price per gram"
  );
  var goldSectionRows = [
    rowBuyGold,
    rowSellGold,
    rowGiftGold,
    rowCurrentGoldRate,
  ];
  var sectionGold = sendMsgs.makeSection("Gold", goldSectionRows);
  var rowProfileLocker = sendMsgs.makeRow(
    "Locker",
    "Locker",
    "to get your current balance"
  );
  var rowProfileChange = sendMsgs.makeRow(
    "Change Profile",
    "Change Profile",
    "to change profile data"
  );
  var rowProfileTransactions = sendMsgs.makeRow(
    "Recent Transactions",
    "Recent Transactions",
    "to view your recent transactions"
  );
  var profileSectionRows = [
    rowProfileLocker,
    rowProfileChange,
    rowProfileTransactions,
  ];
  var sectionProfile = sendMsgs.makeSection("Profile", profileSectionRows);
  var rowContact = sendMsgs.makeRow(
    "Contact Us",
    "Contact Us",
    "to contact us"
  );
  var rowFeedback = sendMsgs.makeRow(
    "FeedBack",
    "FeedBack",
    "to give us feedback"
  );
  var supportSectionRows = [rowContact, rowFeedback];
  var sectionSupport = sendMsgs.makeSection("Support", supportSectionRows);
  var mainMenuSections = [sectionGold, sectionProfile, sectionSupport];
  var mainMenuText = `Welcome ${accounts[message.from].userName}`;
  var mainMenuMsg = sendMsgs.makeInteractiveListMsg(
    message.from,
    mainMenuSections,
    mainMenuText
  );
  return mainMenuMsg;
};

const getCurrentGoldRate = async () => {
  var goldPriceData = {};
  await axios
    .get(`${process.env.BACKEND_URL}/augmont/goldrate`)
    .then((res) => {
      goldPriceData = {
        totalBuyPrice: res.data.totalBuyPrice,
        tax: res.data.tax,
        blockId: res.data.blockId,
        buyPrice: res.data.goldPrice,
        totalSellPrice: res.data.totalSellPrice,
      };
    })

    .catch((err) => {
      console.log(err);
    });
  return goldPriceData;
};

const buyGold = async (buyPrice, amount, uniqueId, blockId) => {
  const merchantTransactionId = nanoid();
  const token = augCtrl.augmontToken;
  var data = new FormData();
  console.log(buyPrice, amount, uniqueId, blockId);
  data.append("lockPrice", buyPrice);
  data.append("metalType", "gold");
  data.append("amount", amount);
  data.append("merchantTransactionId", merchantTransactionId);
  data.append("uniqueId", uniqueId);
  data.append("blockId", blockId);

  const user = await User.findById(uniqueId).exec();

  var config = {
    method: "post",
    url: `${process.env.AUGMONT_URL}/merchant/v1/buy`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config)
    .then(async function (response) {
      const id = response.data.result.data.uniqueId;
      const newBuy = new Buy(response.data.result.data);
      await newBuy.save();

      const newAmount = (
        parseFloat(user.totalAmount) +
        parseFloat(response.data.result.data.preTaxAmount)
      ).toFixed(2);

      await User.findByIdAndUpdate(id, {
        totalAmount: newAmount,
        goldBalance: response.data.result.data.goldBalance,
      });
      var text = `Successfully bought ${response.data.result.data.quantity}g or ₹${response.data.result.data.totalAmount}`;

      sendMsgs.sendTextMsg(`91${user.mobileNumber}`, text);
    })
    .catch(function (error) {
      console.log(error);
      var text = `Buy unsuccessful due to an error`;

      sendMsgs.sendTextMsg(`91${user.mobileNumber}`, text);
    });
};
