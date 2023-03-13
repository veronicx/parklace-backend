

const express = require('express');
const router = express.Router();
const multer = require('multer');
const spaces = require('../controllers/space')
const analytics = require('../controllers/analytics')
const panel = require('../controllers/panel')

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const orders = require('../controllers/orders')


// SPACES
router.post('/spaces/add', spaces.add);
router.get('/spaces/get/:id', spaces.get)
router.get('/spaces/one/:id', spaces.one)
router.get('/spaces/listing', spaces.listing)
router.get('/spaces/regional/:zoom', spaces.getMarkersByZoomLevel)
router.delete('/spaces/delete/:id', spaces.remove)

// ANALYTICS


router.post('/analytics/create', analytics.create)
router.put('/analytics/view/add', analytics.addView)
router.get('/analytics/:id/:type/', analytics.general)



// PANEL

router.get('/space/panel/:id', panel.get)

// Orders
router.post('/order/new',  orders.schedule)
router.get('/order/listing/:id/:type/:offset?/:limit?/:start?/:end?', orders.listing)
router.get('/order/chart/:id/:type', orders.chart)
router.get('/order/user/:id', orders.userOrder)
router.post('/order/plate', orders.plate)

module.exports = router
