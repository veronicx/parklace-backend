const Orders = require('../models/ordersModel')

exports.add =  async (req, res) => { 
    try { 
        const order = new Orders({
            'space-id': req.body.id,
            'order-pricepoints': req.body['order-pricepoints'],
            'special-privileges': req.body['special-privileges'],
            'orders-collection': req.body.orders
        })
        await order.save()
            res.send(order)

    } catch(error) { 
        console.log('error')
    }
}