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

exports.general = async (req,res) => {
    try {
        const spaceId = req.params.id;
        const type = req.params.type;
        let query = {};

        if (type === 'monthly') {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            query = {
                'space-id': spaceId,
                'views.viewed': {
                    $gte: new Date(`${year}-${month}-01T00:00:00.000Z`),
                    $lt: new Date(`${year}-${month+1}-01T00:00:00.000Z`)
                }
            };
        } else if (type === 'yearly') {
            const year = new Date().getFullYear();
            query = {
                'space-id': spaceId,
                'views.viewed': {
                    $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    $lt: new Date(`${year+1}-01-01T00:00:00.000Z`)
                }
            };
        } else if (type === 'custom') {
            const start = new Date(req.params.start);
            const end = new Date(req.params.end);
            query = {
                'space-id': spaceId,
                'views.viewed': {
                    $gte: start,
                    $lt: end
                }
            };
        }

        const analytics = await Analytics.find(query).exec();
        console.log(analytics);
        res.send(analytics)
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}
