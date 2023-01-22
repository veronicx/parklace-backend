const mongoose = require('../database/mongo')

const Orders = new mongoose.Schema({ 
    'space-id': { 
        type: String,
        required: true,
    },
    'order-pricepoints': {
        type: Array,
        required: true,
    },
    'special-privileges': { 
        type: Boolean,
        required: true,
    },
    'orders-collection': { 
        type: Array,
        required: true,
    }

    /* /* special-privileges

})

module.exports = mongoose.model('orders', Orders)