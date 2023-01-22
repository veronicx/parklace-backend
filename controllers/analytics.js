const Analytics = require('../models/analyticsModel')

exports.create = async (req, res) => {
    try {
        const analytics = new Analytics({
            'space-id': req.body.id,
            'space-amount': req.body.amount,
            views: req.body.views
        })
        analytics.save()
        res.send(analytics)
     }
    catch (error)
    {
        console.log('error on anayltics')
    }
}

exports.find = async (req, res) => { 
    try { 
        const analytic = await Analytics.findOne({ 'space-id': req.params.id })
        res.send(analytic)
    } catch (err) { 
        console.log('err')
    }
}

exports.addView = async (req, res) => { 
    try { 
        const space = await Analytics.updateOne({ 'space-id': req.body.id }, { $push: { views: req.body.view } })
        res.send(space)
    } catch (error) { 
        console.log('error on view')
    }
}
