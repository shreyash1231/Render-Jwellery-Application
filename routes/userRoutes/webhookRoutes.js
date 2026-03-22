const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const OrderService = require('../../services/orderService');

// Razorpay sends JSON with a signature in header 'x-razorpay-signature'
router.post('/webhook/razorpay', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    try {
        await OrderService.handleWebhook(req.body, signature);
        res.status(200).send('OK');
    } catch (err) {
        res.status(400).send('Invalid signature');
    }
});

module.exports = router;
