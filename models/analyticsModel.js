const mongoose = require('../database/mongo')

const Analytics = new mongoose.Schema({
    'space-id': {
        type: String,
        required: true,
    },
    'space-amount': { 
        type: Number,
        required: true,
    },
    'views': { 
        type: Array,
        required: true,
    },
})

module.exports = mongoose.model('analytics', Analytics)