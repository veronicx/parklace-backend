const Orders = require('../models/ordersModel')
const Agenda = require('agenda')
const mongoose = require('../database/mongo')

const qrcode = require('qrcode')

const agenda = new Agenda({mongo: mongoose.connection})

agenda.define('update order completion status', async (job, done) => {
  console.log('TRIGGERED')
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
      'person-id': req.body['person-id'],
      'person-name': req.body['person-name'],
      'person-email': req.body['person-email'],
      'person-phone': req.body['person-phone'],
      'order-duration': req.body['order-duration'],
      'order-price': req.body['order-price'],
      'order-privilege': req.body['order-privilege'],
      'ordered-at': Date.now()
    });
    await order.save();
    await agenda.schedule(req.body['order-duration']['endAt'], 'update order completion status', { orderId: order._id })


    
    const qrImage = await qrcode.toDataURL(`http://${req.body.org}/order/${order._id}`);
    const base64Image = qrImage.toString('base64');
    await Orders.findOneAndUpdate({_id: order._id}, {$set: {'qr-code': base64Image}})

    

    res.send({
      'qr-code': base64Image,
      'order-id': order._id
    });
  } catch(error) { 
    res.send(error.message)
  }
}

exports.listing = async (req,res) => { 
  try { 
     const orders = await Orders.find({'space-id': req.params.id}).limit(req.params.limit)
     res.send(orders)
      
  }catch(error){ 
    console.log(error)
  }
}

exports.monthly = async(req,res) => { 
  try { 
    const spaceId = req.params.id
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
   const orders = await Orders.find({
      'space-id': spaceId,
      'ordered-duration.startAt': {
        $gte: startOfMonth,
        $lt: endOfMonth
      }
    })
    res.send(orders)

  }catch(error){ 
    res.send(error)
  }
}
