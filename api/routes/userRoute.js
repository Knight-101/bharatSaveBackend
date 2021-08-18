const router = require('express').Router();
const controller = require('../controllers/user.controller');

router.get('/', controller.getUserDetails);

router.get('/bankDetails', controller.getBankDetails);

module.exports = router;