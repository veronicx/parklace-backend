const Orders = require('../models/ordersModel')

exports.add =  async (req, res) => { 
    try { 
        const order = new Orders({
            'space-id': req.body.id,
            'order-duration': req.body.duration,
            'order-price': req.body.price,
            'special-privileges': req.body.specials
            
        })
        await order.save()
            res.send(order)

    } catch(error) { 
        console.log('error')
    }
}