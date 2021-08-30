const templates = require("./Templates");
const axios = require("axios").default;

exports.sendMsg = async (data) => {
  await axios
    .post(`https://waba-sandbox.360dialog.io/v1/messages`, data, {
      headers: {
        "D360-API-Key": "9k8w3o_sandbox",
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.sendTextMsg = (to, text) => {
  let msg = JSON.parse(JSON.stringify(templates.textMessage));
  msg.to = to;
  msg.text.body = text;
  this.sendMsg(msg);
};

exports.sendInteractiveButtonMsg = (to, buttons, text) => {
  let msg = JSON.parse(JSON.stringify(templates.interactiveButton));
  msg.to = to;
  msg.interactive.body.text = text;
  msg.interactive.action.buttons = buttons;
  this.sendMsg(msg);
};

exports.makeButton = (id, text) => {
  let button = JSON.parse(JSON.stringify(templates.interactiveButtonTemplate));
  button.reply.title = text;
  button.reply.id = id;
  return button;
};

exports.makeInteractiveListMsg = (to, sections, text) => {
  let msg = JSON.parse(JSON.stringify(templates.interactiveList));
  msg.to = to;
  msg.interactive.body.text = text;
  msg.interactive.action.sections = sections;
  return msg;
};

exports.makeSection = (title, rows) => {
  let section = JSON.parse(
    JSON.stringify(templates.interactiveSectionTemplate)
  );
  section.title = title;
  section.rows = rows;
  return section;
};

exports.makeRow = (id, title, description) => {
  let row = JSON.parse(JSON.stringify(templates.interactiveRowTemplate));
  row.title = title;
  row.description = description;
  row.id = id;
  return row;
};
