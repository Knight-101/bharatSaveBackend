const templates = require("./Templates");

exports.welcomeMsg = () => {
  var newUserButtons = JSON.parse(JSON.stringify(templates.interactiveButton));
  newUserButtons.interactive.body.text =
    "Hello, 👋 Welcome to Bharat Save. I am A/B, a representative of Bharat Save here on on your service.How Can I help you?";

  var downloadAppBtn = JSON.parse(
    JSON.stringify(templates.interactiveButtonTemplate)
  );
  downloadAppBtn.reply.id = "Download the app";
  downloadAppBtn.reply.title = "Download the app";

  var openAccBtn = JSON.parse(
    JSON.stringify(templates.interactiveButtonTemplate)
  );
  openAccBtn.reply.id = "Open a new account";
  openAccBtn.reply.title = "Open a new account";

  var knowMoreBtn = JSON.parse(
    JSON.stringify(templates.interactiveButtonTemplate)
  );
  knowMoreBtn.reply.id = "Know more about us";
  knowMoreBtn.reply.title = "Know more about us";

  newUserButtons.interactive.action.buttons.push(downloadAppBtn);
  newUserButtons.interactive.action.buttons.push(openAccBtn);
  newUserButtons.interactive.action.buttons.push(knowMoreBtn);
  console.log(newUserButtons.interactive.action.buttons);
  return newUserButtons;
};

exports.openAccName = () => {
  var openAccNameMsg = templates.textMessage;
  openAccNameMsg.text.body =
    "Definetely, lets get you started.Can you please tell me your full name so that I can get you a digital GOLD Locker? 🔒";

  return openAccNameMsg;
};

exports.openAccNameConfirm = () => {
  var openAccNameConfirm = templates.interactiveButton;
  openAccNameConfirm.interactive.body.text = "";

  var yesBtn = JSON.parse(JSON.stringify(templates.interactiveButtonTemplate));
  yesBtn.reply.id = "Yes";
  yesBtn.reply.title = "Yes";

  var changeBtn = JSON.parse(
    JSON.stringify(templates.interactiveButtonTemplate)
  );
  changeBtn.reply.id = "No, I want to change";
  changeBtn.reply.title = "No, I want to change";

  openAccNameConfirm.interactive.action.buttons.push(yesBtn);
  openAccNameConfirm.interactive.action.buttons.push(changeBtn);

  return openAccNameConfirm;
};

exports.openAccNameChange = () => {
  var openAccNameChange = templates.textMessage;
  openAccNameChange.text.body =
    "No Problem, What’s your correct full name?(Type Carefully this time)";

  return openAccNameChange;
};

exports.openAccEmail = () => {
  var openAccEmailMsg = templates.textMessage;
  openAccEmailMsg.text.body =
    "Cool name 😏, Can you also type in your email ID?";

  return openAccEmailMsg;
};

exports.openAccEmailConfirm = () => {
  var openAccEmailConfirm = templates.interactiveButton;
  openAccEmailConfirm.interactive.body.text =
    "harshdeep0502@gmail.com is that correct?";

  var yesBtn = JSON.parse(JSON.stringify(templates.interactiveButtonTemplate));
  yesBtn.reply.id = "Yes";
  yesBtn.reply.title = "Yes";

  var changeBtn = JSON.parse(
    JSON.stringify(templates.interactiveButtonTemplate)
  );
  changeBtn.reply.id = "No, I want to change";
  changeBtn.reply.title = "No, I want to change";

  openAccEmailConfirm.interactive.action.buttons.push(yesBtn);
  openAccEmailConfirm.interactive.action.buttons.push(changeBtn);

  return openAccEmailConfirm;
};

// exports.accCreatedMsg = () => {
//   var accCreatedMsg = templates.textMessage;
//   accCreatedMsg.text.body = "";
//   return accCreatedMsg;
// }
