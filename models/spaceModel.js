
const mongoose = require('../database/mongo')

const Schema = mongoose.Schema

const Space = new Schema({ 
    title: { 
        type: String,
        required: true,
    },
    amount: { 
        type: Number,
        required: true,
    },
    location: {
        type: Object,
        required: true,
    },
    premiumFeatures: { 
        type: Object,
        required: true,
    },
    createdBy: { 
        type: String,
        required: true,
    },
    createdAt: { 
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model('space', Space)