const newUserMsgs = require("./newUserMessages");
const templates = require("./Templates");
const axios = require("axios").default;

//send post req
const sendMsg = async (data) => {
  await axios
    .post(`https://waba-sandbox.360dialog.io/v1/messages`, data, {
      headers: {
        "D360-API-Key": "Pr16rc_sandbox",
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.response.data.errors);
    });
};

//wait for reply or timeout 1 min and repeat
// var msgReceived = {
//   messages: [
//     {
//       context: { from: "4930609859535", id: "gBEGkWJkUkQEAglRuIoguyqrP5M" },
//       from: "916264524404",
//       id: "ABEGkWJkUkQEAgo-sAC0l9ufL1vw",
//       interactive: {
//         button_reply: { id: "12345", title: "First Button" },
//         type: "button_reply",
//       },
//       timestamp: "1629894874",
//       type: "interactive",
//     },
//   ],
//   contacts: [{ profile: { name: "Sanskar" }, wa_id: "916264524404" }],
// };
// if (msgReceived.messages[0].interactive) {
//   if (
//     msgReceived.messages[0].interactive.button_reply.id ===
//     downloadAppBtn.reply.id
//   ) {
//     var replyLink = Object.assign({}, templates.textMessage);
//     replyLink.text.body = "https://bharatsave.com";
//   } else if (
//     msgReceived.messages[0].interactive.button_reply.id === openAccBtn.reply.id
//   ) {
//     var replyName = Object.assign({}, templates.textMessage);
//     replyName.text.body =
//       "Definetely, lets get you started.Can you please tell me your full name so that I can get you a digital GOLD Locker? 🔒";
//     //send msg
//     //confirmation msg
//     //ask for email
//     //confirm email
//     //send welcome msg
//   } else {
//     //send about msg
//   }
// } else {
//   //didn't get you and send again
// }

exports.newAccFunc = async (req, res, next) => {
  console.log(req.body);
  if (req.body.messages) {
    if (req.body.messages[0].type === "text") {
      await sendMsg(newUserMsgs.welcomeMsg());
    } else if (req.body.messages[0].type === "interactive") {
      if (
        req.body.messages[0].interactive.button_reply.id === "Download the app"
      ) {
        var replyLink = Object.assign({}, templates.textMessage);
        replyLink.text.body = "https://bharatsave.com";
        sendMsg(replyLink);
      } else if (
        req.body.messages[0].interactive.button_reply.id ===
        "Open a new account"
      ) {
        var replyName = Object.assign({}, templates.textMessage);
        replyName.text.body =
          "Definetely, lets get you started.Can you please tell me your full name so that I can get you a digital GOLD Locker? 🔒";
        sendMsg(replyName);
      } else if (
        req.body.messages[0].interactive.button_reply.id ===
        "Know more about us"
      ) {
        var replyLink = Object.assign({}, templates.textMessage);
        replyLink.text.body = "https://bharatsave.com";
        sendMsg(replyLink);
      }
    }
  }
};
