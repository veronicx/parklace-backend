

const express = require('express');
const router = express.Router();

const spaces = require('../controllers/space')
const analytics = require('../controllers/analytics')
const panel = require('../controllers/panel')
const orders = require('../controllers/orders')
// SPACES
router.post('/spaces/add', spaces.add);
router.get('/spaces/get/:id', spaces.get)
router.get('/spaces/one/:id', spaces.one)
router.get('/spaces/listing', spaces.listing)

// ANALYTICS


router.post('/analytics/create', analytics.create)
router.put('/analytics/view/add', analytics.addView)


// PANEL

router.get('/space/panel/:id', panel.get)

// Orders
router.post('/order/new',  orders.schedule)

module.exports = router
