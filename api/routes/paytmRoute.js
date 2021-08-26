const router = require('express').Router();
const paytmController = require('../controllers/paytm.controller');

router.post('/initiateTransaction', paytmController.initiateTransaction);

router.get('/transactionStatus', paytmController.checkTransactionStatus);

router.post('/createSubscription', paytmController.createSubscription);

router.post('/manualCollect', paytmController.renewSubscription);

router.get('/subscriptionStatus', paytmController.checkSubscriptionStatus);

router.post('/cancelSubscription', paytmController.cancelSubscription);

module.exports = router;