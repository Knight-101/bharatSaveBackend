const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const dateFns = require('date-fns');
const Paytm = require('paytmchecksum');
const User = require('../models/User');

exports.initiateTransaction = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.sendStatus(401);
    }
    const userToken = authHeader.split(' ')[1];
    jwt.verify(userToken, process.env.TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        const orderId = `ORDERID_${nanoid(6)}`;

        try {
            const body = {
                requestType: "Payment",
                mid: process.env.PAYTM_MID,
                websiteName: "WEBSTAGING",
                orderId,
                callbackUrl: `${process.env.PAYTM_URL}/theia/paytmCallback?ORDERID=${orderId}`,
                txnAmount: {
                    value: req.body.amount,
                    currency: "INR"
                },
                userInfo: {
                    custId: decoded._id
                }
            };
            const checksum = await Paytm.generateSignature(JSON.stringify(body), process.env.PAYTM_KEY);
            const head = { signature: checksum };

            const response = await axios.post(`${process.env.PAYTM_URL}/theia/api/v1/initiateTransaction`, {
                body,
                head
            }, {
                params: {
                    mid: process.env.PAYTM_MID,
                    orderId
                }
            });
            if (response.status === 200) {
                const checksum = response.data.head.signature;
                const isValid = await Paytm.verifySignature(JSON.stringify(response.data.body), process.env.PAYTM_KEY, checksum);
                if (isValid) {
                    return res.json({
                        orderId,
                        mid: process.env.PAYTM_MID,
                        token: response.data.body.txnToken
                    });
                } else {
                    throw new Error('Checksum mismatch');
                }
            } else {
                res.status(500).json({
                    error: response.data.body.resultInfo.resultMsg
                });
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    });
};

const planTypeMap = {
    'Round Up': {
        type: 'VARIABLE',
        unit: 'DAY'
    },
    'Daily Savings': {
        type: 'FIX',
        unit: 'DAY'
    },
    'Weekly Savings': {
        type: 'FIX',
        unit: 'WEEK'
    },
    'Monthly Savings': {
        type: 'FIX',
        unit: 'MONTH'
    }
};

exports.createSubscription = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.sendStatus(401);
    }
    const userToken = authHeader.split(' ')[1];
    jwt.verify(userToken, process.env.TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        const orderId = `ORDERID_${nanoId(6)}`;

        try {
            const body = {
                requestType: 'NATIVE_SUBSCRIPTION',
                mid: process.env.PAYTM_MID,
                websiteName: 'WEBSTAGING',
                orderId,
                callbackUrl: `${process.env.PAYTM_URL}/theia/paytmCallback?ORDERID=${orderId}`,
                subscriptionAmountType: planTypeMap[req.body.planName].type,
                subscriptionFrequencyUnit: planTypeMap[req.body.planName].unit,
                subscriptionFrequency: '1',
                subscriptionPaymentMode: 'UPI',
                subscriptionEnableRetry: '1',
                subscriptionRetryCount: '2',
                subscriptionStartDate: req.body.startDate,
                subscriptionEndDate: dateFns.format(dateFns.addYears(new Date(req.body.startDate), 10), 'YYYY-MM-DD'),
                renewalAmount: req.body.amount,
                autoRenewal: true,
                autoRetry: true,
                txnAmount: {
                    value: "1.00",
                    currency: "INR"
                },
                userInfo: {
                    custId: decoded._id
                }
            };
            const checksum = await Paytm.generateSignature(JSON.stringify(body), process.env.PAYTM_KEY);
            const head = { signature: checksum };
            
            const response = await axios.post(`${process.env.PAYTM_URL}/subscription/create`, {
                body,
                head
            }, {
                params: {
                    mid: process.env.PAYTM_MID,
                    orderId
                }
            });
            if (response.status === 200) {
                const checksum = response.data.head.signature;
                const isValid = await Paytm.verifySignature(JSON.stringify(body), process.env.PAYTM_KEY, checksum);
                if (isValid) {
                    const userDoc = await User.findOne({ _id: decoded._id }).lean();
                    const updatedPlans = userDoc.activePlans.filter(plan => plan.planName !== req.body.planName);
                    updatedPlans.push({
                        planName: req.body.planName,
                        subscriptionId: response.data.body.subscriptionId
                    });
                    userDoc.activePlans = updatedPlans;
                    await userDoc.save();
                    return res.json({
                        orderId,
                        mid: process.env.PAYTM_MID,
                        subscriptionId: response.data.body.subscriptionId,
                        token: response.data.body.txnToken
                    });
                } else {
                    throw new Error('Checksum mismatch');
                }
            } else {
                res.status(500).json({
                    error: response.data.body.resultInfo.resultMsg
                });
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    });
};