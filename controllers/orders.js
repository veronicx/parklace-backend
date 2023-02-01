const Orders = require('../models/ordersModel')

exports.add =  async (req, res) => { 
    try { 
        const order = new Orders({
            'space-id': req.body['space-id'],
            'person-name': req.body['person-name'],
            'person-email': req.body['person-email'],
            'person-phone': req.body['person-phone'],
            'order-duration': req.body['order-duration'],
            'order-price': req.body['order-price'],
            'order-privilege': req.body['order-privilege'],
            'ordered-at': Date.now()
            
        })
        await order.save()
            res.send(order)

    } catch(error) { 
        console.log('error')
    }
}