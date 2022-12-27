

const express = require('express');
const router = express.Router();

const spaces = require('../controllers/space')


router.post('/spaces/add', spaces.add);

module.exports = router
