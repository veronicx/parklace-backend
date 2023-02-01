const Orders = require('../models/ordersModel')
const Agenda = require('agenda')
const mongoose = require('../database/mongo')

const agenda = new Agenda({mongo: mongoose.connection})

agenda.define('update order completion status', async (job, done) => {
  console.log('triggered')
  const order = await Orders.findById(job.attrs.data.orderId)

  order['order-duration'].completed = true

  await order.save()

  done()
})

agenda.start()

exports.schedule =  async (req, res) => {
  try{
    console.log('trigger')
    const order = new Orders({
      'space-id': req.body['space-id'],
      'person-name': req.body['person-name'],
      'person-email': req.body['person-email'],
      'person-phone': req.body['person-phone'],
      'order-duration': {
        startAt: req.body['order-duration']['startAt'],
        endAt: req.body['order-duration']['endAt'],
        completed: false
      },
      'order-price': req.body['order-price'],
      'order-privilege': req.body['order-privilege'],
      'ordered-at': Date.now()
    });
    
    await order.save();

    await agenda.schedule(req.body['order-duration']['endAt'], 'update order completion status', { orderId: order._id })
  
    res.send("Order created and scheduled");
  } catch(error) { 
    res.send(error.message)
  }
};