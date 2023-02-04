const Analytics = require('../models/analyticsModel')
const Space = require('../models/spaceModel')


exports.get = async (req, res) => { 
    try {

        const space = await Space.find({ _id: req.params.id })
        // const analytics = await Analytics.find({ 'space-id': req.params.id })
        res.send({space})
    } catch (error) { 
        console.log('error on panel')
    }
}