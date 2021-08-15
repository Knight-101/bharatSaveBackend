const User = require("../models/User");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const FormData = require("form-data");
const jwt = require("jsonwebtoken");
const Buy = require("../models/Buy");
var qs = require("qs");
const Sell = require("../models/Sell");

const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiMTE1Njg2ZGRmNTBmMzlmZjdlZGQ5OGMxMDA2NmE5YmUzMzkyMmQ5NDg4Yjc0NjMxNGE2ZGI5MTZjNjU2ZGRiNzc1ZWI3ODQzYjQyMGJhODIiLCJpYXQiOjE2Mjg2MTMwMTEsIm5iZiI6MTYyODYxMzAxMSwiZXhwIjoxNjMxMjA1MDExLCJzdWIiOiI1MDAwMDE0NSIsInNjb3BlcyI6W119.L34DlHj6eRbykApwSBUTR5nRGAc90T_369xXsBa0chZRZFkrOTYKvh1eWwoUm4UKNUhz3pb5h4qqLcgTbl_icoM5hZLCIj3eaHN9Mzuqnu2QI0u3Zr8R-XMXLD99Bw-0wSfBjkT2YTMt35-z0CxmmjYvkhZcHU1eL_XZIccsaFR6GjzB6J3kyVJKver2o_We93x9a_C8_RPbAe25ha3bnlqTqd8PKtC-CYxYQTRYgo8r6zSO-QoBpmeF0i-7ItZth8WyRHvYCJ8YxeGBOoEl9hSt7-ZCznHPk1ew52w5YigEBJXosYeN-Kqvu8kOoLiF3p6zKfWJmo7h8aWGA6cm6zKkH9kv4Y1mX3Dx8J1vx5320O4I_HuvqQCU3sx1Y4382xyWLj3aFkhWyce8dfD7ZKYpbZbm5lc7x2R8eCg4CVznZEDQX98cBDso4RzWGxbt16_-fco2CS5tznwMJqyaqlquHnv8GDrRzuj7QT_Zx9ih7zk87HxNXEeRJT6wTpEYMoSYAhPyXSHG-XiNBRoQYueh9DGPVMTHYg7TtQsWtfwO3kJvh398rpk9BkPfgSr2QCAdbieNE-GVs0-0cuvjKFSU5qE1LYESHK2rxAu-TSVSVO5yN50byHBBt2_85P9A_7O3lILTtsa6ZvtRu7TwMvQyrIQ0mS_Kt3ysjJ874lA";

// var data = new FormData();
// data.append("email", "devansh299@gmail.com");
// data.append("password", "FsKaH@12$3Kl#");

// var config = {
//   method: "post",
//   url: "https://uat-api.augmontgold.com/api/merchant/v1/auth/login",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     ...data.getHeaders(),
//   },
//   data: data
// };

// axios(config)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

//sanskar's uniquecode =e505e888-ca94-429f-a2e9-52b97b93191f

exports.buyList = async (req, res, next) => {
  try {
    var config = {
      method: "get",
      url: `${process.env.AUGMONT_URL}/merchant/v1/${req.body.uniqueCode}/buy`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then(function (response) {
        res.json(response.data.result.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.sellList = async (req, res, next) => {
  try {
    var config = {
      method: "get",
      url: `${process.env.AUGMONT_URL}/merchant/v1/${req.body.uniqueCode}/sell`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then(function (response) {
        res.json(response.data.result.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.createUser = async (req, res, next) => {
  const unique_id = uuidv4();
  var data = new FormData();
  data.append("mobileNumber", req.body.mobileNumber);
  data.append("emailId", req.body.emailId);
  data.append("uniqueId", unique_id);
  data.append("userName", req.body.userName);
  data.append("userPincode", req.body.userPincode);

  var config = {
    method: "post",
    url: `${process.env.AUGMONT_URL}/merchant/v1/users`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...data.getHeaders(),
    },
    data: data,
  };
  try {
    await User.findOne(
      { mobileNumber: req.body.mobileNumber },
      async (err, foundUser) => {
        if (foundUser) {
          res.send("User already exists");
        } else {
          await axios(config)
            .then(async (response) => {
              console.log(response.data.message);
              //create a user
              const user = new User({
                _id: unique_id,
                mobileNumber: req.body.mobileNumber,
                emailId: req.body.emailId,
                userName: req.body.userName,
                userPincode: req.body.userPincode,
              });
              try {
                await user.save();
                const appToken = jwt.sign(
                  { _id: unique_id },
                  process.env.TOKEN_SECRET,
                  {
                    expiresIn: "3hr",
                  }
                );

                res.json({ ok: 1, token: appToken });
              } catch (error) {
                console.log(error);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    );
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.login = async (req, res) => {
  try {
    //check if email doesn't exist
    User.findOne(
      { mobileNumber: req.body.mobileNumber },
      async (err, foundUser) => {
        if (!foundUser) {
          res.send("User not found");
        } else {
          const apptoken = jwt.sign(
            { _id: foundUser._id },
            process.env.TOKEN_SECRET,
            {
              expiresIn: "3hr",
            }
          );
          res.json({ token: apptoken });
        }
      }
    );
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.isAuth = async (req, res) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader) {
      const usertoken = authHeader.split(" ")[1];

      jwt.verify(usertoken, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        } else {
          return res.sendStatus(200);
        }
      });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.goldRate = async (req, res, next) => {
  try {
    axios
      .get(`${process.env.AUGMONT_URL}/merchant/v1/rates`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const BuyPrice = response.data.result.data.rates.gBuy;
        const tax = response.data.result.data.rates.gBuyGst;
        const blockId = response.data.result.data.blockId;
        const totalSellPrice = parseFloat(
          response.data.result.data.rates.gSell
        ).toFixed(2);
        const totalBuyPrice = (parseFloat(BuyPrice) + parseFloat(tax)).toFixed(
          2
        );
        res.status(200).json({
          ok: 1,
          totalBuyPrice: totalBuyPrice,
          totalSellPrice: totalSellPrice,
          blockId: blockId,
          goldPrice: BuyPrice,
          tax: tax,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.buyGold = async (req, res, next) => {
  const merchantTransactionId = uuidv4();
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const usertoken = authHeader.split(" ")[1];

    jwt.verify(usertoken, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const uniqueId = user._id;
      try {
        var data = new FormData();
        data.append("lockPrice", req.body.buyPrice);
        data.append("metalType", "gold");
        data.append("amount", req.body.amount);
        data.append("merchantTransactionId", merchantTransactionId);
        data.append("uniqueId", uniqueId);
        data.append("blockId", req.body.blockId);

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
            const user = await User.findById(id).exec();
            const newAmount = (
              parseFloat(user.totalAmount) +
              parseFloat(response.data.result.data.totalAmount)
            ).toFixed(2);

            await User.findByIdAndUpdate(id, {
              totalAmount: newAmount,
              goldBalance: response.data.result.data.goldBalance,
            });
            res.sendStatus(200);
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    });
  } else {
    res.sendStatus(401);
    next();
  }
};

exports.sellGold = async (req, res, next) => {
  const merchantTransactionId = uuidv4();
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const uniqueId = user._id;
      try {
        var data = new FormData();
        data.append("uniqueId", uniqueId);
        data.append("mobileNumber", req.body.mobileNumber);
        data.append("lockPrice", req.body.lockPrice);
        data.append("blockId", req.body.blockId);
        data.append("metalType", "gold");
        data.append("amount", req.body.amount);
        data.append("merchantTransactionId", merchantTransactionId);
        data.append("userBank[userBankId]", req.body.userBankId);

        var config = {
          method: "post",
          url: `${process.env.AUGMONT_URL}/merchant/v1/sell`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            ...data.getHeaders(),
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            const id = response.data.result.data.uniqueId;
            const newSell = new Sell(response.data.result.data);
            await newSell.save();
            const user = await User.findById(id).exec();
            const newAmount = (
              parseFloat(user.totalAmount) -
              parseFloat(response.data.result.data.totalAmount)
            ).toFixed(2);

            await User.findByIdAndUpdate(id, {
              totalAmount: newAmount,
              goldBalance: response.data.result.data.goldBalance,
            });

            res.status(200).json({ ok: 1 });
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
        next();
      }
    });
  } else {
    res.sendStatus(401);
    next();
  }
};

exports.bankCreate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const uniqueId = user._id;
      try {
        var data = qs.stringify({
          accountNumber: req.body.accountNumber,
          accountName: req.body.accountName,
          ifscCode: req.body.ifscCode,
        });
        var config = {
          method: "post",
          url: `${process.env.AUGMONT_URL}/merchant/v1/users/${uniqueId}/banks`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            const id = response.data.result.data.uniqueId;
            const filter = { _id: id };
            const update = { $push: { userBanks: response.data.result.data } };

            await User.findOneAndUpdate(filter, update);

            res.status(200).json({ ok: 1 });
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
        next();
      }
    });
  } else {
    res.sendStatus(401);
    next();
  }
};
