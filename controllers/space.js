const Space = require('../models/spaceModel')


exports.add = (req, res) => { 
    try { 
        const newSpace = new Space({ 
            title: req.body.title, 
            amount: req.body.amount || 20, 
            location: req.body.location, 
            premiumFeatures: req.body.premiumFeatures,
            createdBy: req.body.createdBy, 
            createdAt: req.body.createdAt || Date.now(),
        })
        newSpace.save();
            res.send({status: 200, code: 'created'})
    } catch (error) { 
            console.log(error)
    }
}