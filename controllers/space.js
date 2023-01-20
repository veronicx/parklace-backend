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