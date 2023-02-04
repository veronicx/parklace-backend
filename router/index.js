

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
router.get('/analytics/:id/monthly/', analytics.monthly)


// PANEL

router.get('/space/panel/:id', panel.get)

// Orders
router.post('/order/new',  orders.schedule)
router.get('/order/listing/:id/:limit', orders.listing)
router.get('/order/monthly/:id', orders.monthly)

module.exports = router
