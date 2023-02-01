const mongoose = require('../database/mongo')

const Orders = new mongoose.Schema({ 
    'space-id': { 
        type: String,
        required: true
    }, 
    'person-name': {
        type: String,
        required: true,
    },
    'person-email': {
        type: String,
        required: true,
    },
    'person-phone': {
        type: String,
        required: true
    },
    'order-duration': { 
        type: {
            startAt: Date,
            endAt: Date,
            completed: Boolean,
        },
        required: true
    },
    'order-price': {
        type: Number,
        required: true
    },
    'order-privilege': {
        type: String,
        required: false,
    },
    'ordered-at': { 
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model('orders', Orders)