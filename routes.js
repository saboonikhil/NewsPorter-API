const express = require('express');
const router = express.Router();
const auth = require('./controllers/auth');
const newspaper_controller = require('./controllers/newspaperController');
const customer_controller = require('./controllers/customerController');
const subscription_controller = require('./controllers/subscriptionController');

router.post('/signIn', auth.signin);
router.post('/signUp', customer_controller.create_customer);
router.get('/api/newspapers', newspaper_controller.newspapers_list);
router.post('/api/customers/:cID/subscriptions', subscription_controller.add_subscription);
router.get('/api/customers/:cID/subscriptions', customer_controller.subscriptions_list);
router.put('/api/subscriptions/:sID', subscription_controller.subscription_update);

module.exports = router;