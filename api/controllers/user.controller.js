const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.getUserDetails = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
        if (authHeader) {
            const userToken = authHeader.split(' ')[1];
            jwt.verify(userToken, process.env.TOKEN_SECRET, async (err, decoded) => {
                if (err) {
                    return res.sendStatus(403);
                }
    
                const user = await User.findById(decoded._id);
                if (!user) {
                    return res.status(404).send({
                        message: 'User does not exist.'
                    });
                    
                }
                res.json({
                    userName: user.userName,
                    emailId: user.emailId,
                    mobileNumber: user.mobileNumber
                });
            });
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.getBalanceDetails = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
      if (authHeader) {
        const usertoken = authHeader.split(" ")[1];
  
        jwt.verify(usertoken, process.env.TOKEN_SECRET, (err, user) => {
          if (err) {
            return res.sendStatus(403);
          } else {
            const uniqueId = user._id;
            User.findOne({ _id: uniqueId }, async (err, foundUser) => {
              if (!foundUser) {
                res.status(404).send("User not found");
              } else {
                res.json({
                  totalAmount: foundUser.totalAmount,
                  goldBalance: foundUser.goldBalance,
                });
              }
            });
          }
        });
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

exports.getBankDetails = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (authHeader) {
            const userToken = authHeader.split(' ')[1];
            jwt.verify(userToken, process.env.TOKEN_SECRET, async (err, decoded) => {
                if (err) {
                    return res.sendStatus(403);
                }
                
                const user = await User.findById(decoded._id);
                if (!user) {
                    return res.status(404).send({
                        message: 'User does not exist.'
                    });
                    
                }
                res.json(user.userBanks);
            });
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};