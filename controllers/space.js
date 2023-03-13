const Space = require('../models/spaceModel')



exports.listing = async (req, res) => {
    try {
        const spaces = await Space.find()
        res.send(spaces)

    } catch (err) {
        console.log(err, 'console of erorr ')
    }
}


exports.add =  async (req, res) => {
    try {
        const newSpace = new Space({
            title: req.body.title,
            amount: req.body.amount || 20,
            location: req.body.location,
            premiumFeatures: req.body.premiumFeatures,
            createdBy: req.body.createdBy,
            createdAt: req.body.createdAt || Date.now(),
            orderPricePoints: req.body.pricePoints
        })
        const space = await newSpace.save();
        res.send(space)

    } catch (error) {
            console.log(error)
    }
}

exports.one = async (req, res) => {
    try {
        const id = req.params.id
        const space = await Space.findOne({ _id: id })
        res.send(space)

    } catch {
        res.send({code: 404, message: 'some issues happened'})
    }
}

exports.get =  async (req, res) => {
    try {
        const spaces = await Space.find({ 'createdBy.uid': req.params.id })
        if (spaces) {
                res.send(spaces)
        }
        else {
            res.send([])
        }

    } catch (error) {
            // console.log(error)
    }
}

exports.getMarkersByZoomLevel =  async (req, res) => {
    const zoom = req.params.zoom

    if (zoom < 5) {
        return res.status(400).send('Zoom level should be greater than or equal to 5');
    }

    try {
        let markers;

        if (zoom < 8) {
            markers = await Space.aggregate([
                {
                    $group: {
                        _id: {
                            shortCode: "$location.shortCode"
                        },
                        location: {
                            $first: "$location"
                        },
                        amount: {
                            $sum: "$amount"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        location: {
                            lng: "$location.lng",
                            lat: "$location.lat"
                        },
                        amount: 1
                    }
                }
            ]);
        } else if (zoom < 10) {
            markers = await Space.aggregate([
                {
                    $group: {
                        _id: {
                            city: "$location.city"
                        },
                        location: {
                            $first: "$location"
                        },
                        amount: {
                            $sum: "$amount"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        location: {
                            lng: "$location.lng",
                            lat: "$location.lat"
                        },
                        amount: 1
                    }
                }
            ]);
        } else {
            markers = await Space.find()

        }

        res.send(markers);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

exports.remove = async (req,res) => {
    try {
        const space = await Space.findOneAndDelete({ _id: req.params.id})
            if(space) {
                res.send('deletion confirmed')
            }
    } catch(err) {
        console.log(err)
        res.send(err.message)
    }
}
