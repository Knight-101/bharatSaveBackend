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
            if (response.status === 200 && response.data.body.resultInfo.resultStatus === 'S') {
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

exports.checkTransactionStatus = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.sendStatus(401);
    }
    const userToken = authHeader.split(' ')[1];

    jwt.verify(userToken, process.env.TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        try {
            const body = {
                mid: process.env.PAYTM_MID,
                orderId: req.params.orderId
            };
            const checksum = await Paytm.generateSignature(JSON.stringify(body), process.env.PAYTM_KEY);
            const head = { signature: checksum };

            const response = await axios.post(`${process.env.PAYTM_URL}/v3/order/status`, { body, head });
            if (response.status === 200 && response.data.body.resultInfo.resultStatus === 'S') {
                const checksum = response.data.head.signature;
                const isValid = await Paytm.verifySignature(JSON.stringify(response.data.body), process.env.PAYTM_KEY, checksum);
                if (isValid) {
                    return res.json({
                        orderId,
                        txnId: response.data.body.txnId,
                        bankTxnId: response.data.body.bankTxnId,
                        txnAmount: response.data.body.txnAmount,
                        txnDate: response.data.body.txnDate,
                        message: response.data.body.resultInfo.resultMsg
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
        const orderId = `ORDERID_${nanoid(6)}`;

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
                subscriptionGraceDays: '3',
                subscriptionStartDate: dateFns.format(new Date(req.body.startDate), 'yyyy-MM-dd'),
                subscriptionExpiryDate: dateFns.format(dateFns.addYears(new Date(req.body.startDate), 10), 'yyyy-MM-dd'),
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
            if (planTypeMap[req.body.planName].unit === 'DAY') {
                body.subscriptionGraceDays = '0';
                body.autoRenewal = false;
                body.autoRetry = false;
            }
            const checksum = await Paytm.generateSignature(JSON.stringify(body), process.env.PAYTM_KEY);
            const head = { signature: checksum };
            
            const response = await axios.post(`${process.env.PAYTM_URL}/subscription/create`, {
                body,
                head
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    mid: process.env.PAYTM_MID,
                    orderId
                }
            });
            if (response.status === 200 && response.data.body.resultInfo.resultStatus === 'S') {
                console.log(response.data);
                const checksum = response.data.head.signature;
                const isValid = await Paytm.verifySignature(JSON.stringify(response.data.body), process.env.PAYTM_KEY, checksum);
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

exports.renewSubscription = async (req, res, next) => {
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
                mid: process.env.PAYTM_MID,
                orderId,
                txnAmount: {
                    value: req.body.amount,
                    currency: "INR"
                },
                subscriptionId: req.body.subscriptionId
            };
            const checksum = await Paytm.generateSignature(JSON.stringify(body), process.env.PAYTM_KEY);
            const head = { signature: checksum };

            const response = await axios.post(`${process.env.PAYTM_URL}/subscription/renew`, {
                body,
                head
            }, {
                params: {
                    mid: process.env.PAYTM_MID,
                    orderId
                }
            });
            if (response.status === 200 && response.data.body.resultInfo.resultStatus === 'S') {
                const checksum = response.data.head.signature;
                const isValid = await Paytm.verifySignature(JSON.stringify(response.data.body), process.env.PAYTM_KEY, checksum);
                if (isValid) {
                    return res.json({
                        orderId,
                        subscriptionId: response.data.body.subscriptionId,
                        message: response.data.body.resultInfo.resultMsg,
                        txnId: response.data.body.txnId
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

exports.checkSubscriptionStatus = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.sendStatus(401);
    }
    const userToken = authHeader.split(' ')[1];
    jwt.verify(userToken, process.env.TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        try {
            const body = {
                subsId: req.params.subscriptionId,
                mid: process.env.PAYTM_MID
            };
            const checksum = await Paytm.generateSignature(JSON.stringify(body), process.env.PAYTM_KEY);
            const head = {
                tokenType: 'AES',
                signature: checksum
            };

            const response = await axios.post(`${process.env.PAYTM_URL}/subscription/checkStatus`, { body, head });
            if (response.status === 200 && response.data.body.resultInfo.status === 'SUCCESS') {
                const checksum = response.data.head.signature;
                const isValid = await Paytm.verifySignature(JSON.stringify(response.data.body), process.env.PAYTM_KEY, checksum);
                if (isValid) {
                    await User.updateOne({ _id: decoded._id, 'activePlans.subscriptionId': req.params.subscriptionId }, {
                        'activePlans.$.status': response.data.body.status.toLowerCase().includes('active')
                    });
                    return res.json({
                        subscriptionId: response.data.body.subsId,
                        status: response.data.body.status,
                        orderId: response.data.body.orderId,
                        frequencyUnit: response.data.body.frequencyUnit,
                        frequency: response.data.body.frequency,
                        expiryDate: response.data.body.expiryDate,
                        custId: response.data.body.custId,
                        lastOrderId: response.data.body.lastOrderId,
                        lastOrderStatus: response.data.body.lastOrderStatus,
                        lastOrderCreationDate: response.data.body.lastOrderCreationDate,
                        lastOrderAmount: response.data.body.lastOrderAmount
                    });
                } else {
                    throw new Error('Checksum mismatch');
                }
            } else {
                res.status(500).json({
                    error: response.data.body.resultInfo.message
                });
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    });
};

exports.cancelSubscription = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.sendStatus(401);
    }
    const userToken = authHeader.split(' ')[1];
    jwt.verify(userToken, process.env.TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        try {
            const body = {
                subsId: req.body.subscriptionId,
                mid: process.env.PAYTM_MID
            };
            const checksum = await Paytm.generateSignature(JSON.stringify(body), process.env.PAYTM_KEY);
            const head = {
                tokenType: 'AES',
                signature: checksum
            };

            const response = await axios.post(`${process.env.PAYTM_URL}/subscription/cancel`, { body, head });
            if (response.status === 200 && response.data.body.resultInfo.status === 'SUCCESS') {
                const checksum = response.data.head.signature;
                const isValid = await Paytm.verifySignature(JSON.stringify(response.data.body), process.env.PAYTM_KEY, checksum);
                if (isValid) {
                    await User.updateOne({ _id: decoded._id }, {
                        $pull: { activePlans: { subscriptionId: req.body.subscriptionId } }
                    });
                    return res.json({
                        subscriptionId: response.data.body.subsId,
                        message: response.data.body.resultInfo.message,
                        custId: response.data.body.custId
                    });
                } else {
                    throw new Error('Checksum mismatch');
                }
            } else {
                res.status(500).json({
                    error: response.data.body.resultInfo.message
                });
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    });
};