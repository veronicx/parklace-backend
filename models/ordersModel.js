const mongoose = require('../database/mongo')

const Orders = new mongoose.Schema({ 
    'space-id': { 
        type: String,
        required: true,
    },
    'order-duration': {
        type: {
            startAt: Date,
            endAt: Date
        },
        required: true,
    },
    'order-price': {
        type: String,
        required: true,
    },

    'special-privileges': { 
        type: Boolean,
        required: true,
    },
})

module.exports = mongoose.model('orders', Orders)