const router = require('express').Router();
const paytmController = require('../controllers/paytm.controller');

router.post('/initiateTransaction', paytmController.initiateTransaction);

router.post('/createSubscription', paytmController.createSubscription);

module.exports = router;