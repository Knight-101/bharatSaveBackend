exports.interactiveButton = {
  to: "",
  type: "interactive",
  interactive: {
    type: "button",
    body: {
      text: "Hello, 👋 Welcome to Bharat Save. I am A/B, a representative of Bharat Save here on on your service.How Can I help you?",
    },
    action: {
      buttons: [],
    },
  },
};

exports.interactiveButtonTemplate = {
  type: "reply",
  reply: {
    id: "12345",
    title: "First Button",
  },
};

exports.interactiveRowTemplate = {
  id: "",
  title: "",
  description: "",
};
exports.interactiveSectionTemplate = {
  title: "",
  rows: [],
};

exports.interactiveList = {
  to: "918968680022",
  type: "interactive",
  interactive: {
    type: "list",
    body: {
      text: "Hello, 👋 Welcome to Bharat Save. I am A/B, a representative of Bharat Save here on on your service.How Can I help you?",
    },
    action: {
      button: "MENU",
      sections: [],
    },
  },
};

exports.textMessage = {
  recipient_type: "individual",
  to: "",
  type: "text",
  text: {
    body: "Hello, Sanskar!",
  },
};

exports.userData = {
  userName: "",
  mobileNumber: "",
  uniqueId: "",
  userPincode: "",
  emailId: "",
};
