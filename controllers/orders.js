const Orders = require('../models/ordersModel')

const Agenda = require('agenda')

const mongoose = require('../database/mongo')

const qrcode = require('qrcode')
const agenda = new Agenda({mongo: mongoose.connection})

agenda.define('update order completion status', async (job, done) => {

  const order = await Orders.findById(job.attrs.data.orderId)

  order['order-duration'].completed = true

  await order.save()
  done()
})

agenda.start()

exports.schedule =  async (req, res) => {
  try{
    const order = new Orders({
      'space-id': req.body['space-id'],
      'space-title': req.body['space-title'],
      'person-id': req.body['person-id'],
      'person-name': req.body['person-name'],
      'person-email': req.body['person-email'],
      'person-phone': req.body['person-phone'],
      'order-duration': req.body['order-duration'],
      'order-price': req.body['order-price'],
      'order-privilege': req.body['order-privilege'],
      'license-plate': req.body['license-plate'],
      'ordered-at': Date.now(),
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

    const spaceId = req.params.id;
    const type = req.params.type;
    let query = {};

    if (type === 'monthly') {

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      query = {
        'space-id': spaceId,
        'order-duration.startAt': { $gte: new Date(`${year}-${month}-01`) },
        'order-duration.endAt': { $lt: new Date(`${year}-${month+1}-01`) }
      };

    } else if (type === 'yearly') {

      const year = new Date().getFullYear();
      query = {
        'space-id': spaceId,
        'order-duration.startAt': { $gte: new Date(`${year}-01-01`) },
        'order-duration.endAt': { $lt: new Date(`${year+1}-01-01`) }
      };

    } else if (type === 'custom') {

      const start = new Date(req.params.start);
      const end = new Date(req.params.end);
      query = {
        'space-id': spaceId,
        'order-duration.startAt': { $gte: start },
        'order-duration.endAt': { $lt: end }
      };

    } else if (type === 'weekly') {

      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7));

      query = {
        'space-id': spaceId,
        'order-duration.startAt': { $gte: startOfWeek },
        'order-duration.endAt': { $lt: endOfWeek }
      };

    }

    const orders = await Orders.find(query)
        .skip(req.params.offset)
        .limit(req.params.limit)
    res.send(orders)

  }catch(error){
    console.log(error)
  }
}





exports.chart = async(req,res) => {
  try {
    const spaceId = req.params.id;
    const type = req.params.type;

    let startDate, endDate, groupBy, dayOfMonth;
    if (type === 'yearly') {
      startDate = new Date(new Date().getFullYear(), 0, 1); // First day of the current year
      endDate = new Date(new Date().getFullYear(), 11, 31); // Last day of the current year
      groupBy = { $month: "$order-duration.startAt" };
      dayOfMonth = 0;
    } else if (type === 'monthly') {
      startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // First day of the current month
      endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0); // Last day of the current month
      groupBy = { $dayOfMonth: "$order-duration.startAt" };
      dayOfMonth = endDate.getDate();
    } else if (type === 'weekly') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - startDate.getDay() + (startDate.getDay() === 0 ? -6 : 1));
      endDate = new Date();
      endDate.setDate(endDate.getDate() - endDate.getDay() + 7);
      groupBy = { $week: "$order-duration.startAt" };
    } else if (type === 'custom') {
      startDate = new Date(req.params.startAt);
      endDate = new Date(req.params.endAt);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      groupBy = diffDays > 31 ? { $month: "$order-duration.startAt" } : { $dayOfMonth: "$order-duration.startAt" };
      dayOfMonth = diffDays;
    }

    const pipeline = [
      {
        $match: {
          "space-id": spaceId,
          "order-duration.startAt": { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ];

    const result = await Orders.aggregate(pipeline);
    const chartData = [];

    if (type === 'yearly') {
      // Initialize the chart data array with zeros
      for (let i = 1; i <= 12; i++) {
        chartData.push(0);
      }
      // Set the order counts for each month
      result.forEach(item => {
        chartData[item._id - 1] = item.count;
      });
    } else if (type === 'monthly') {
      // Initialize the chart data array with zeros
      for (let i = 1; i <= dayOfMonth; i++) {
        chartData.push(0);
      }
      // Set the order counts for each day/month
      result.forEach(item => {
        chartData[item._id - 1] = item.count;
      });
    } else if (type === 'weekly') {
      // Initialize the chart data array with zeros
      for (let i = 1; i <= 7; i++) {
        chartData.push(0);
      }
      // Set the order counts for each day of the week
      result.forEach(item => {
        chartData[item._id] = item.count;
      });
    } else if (type === 'custom') {
      // Initialize the chart data array with zeros
      for (let i = 1; i <= dayOfMonth; i++) {
        chartData.push(0);
      }
      // Set the order counts for each day/month
      result.forEach(item => {
        chartData[item._id - 1] = item.count;
      });
    }

    res.status(200).json(chartData);
  } catch(error) {
    res.send(error.message)
  }
}


exports.userOrder = async (req, res) => {
  try {
    const id = req.params.id
    const orders = await Orders.find({ 'person-id': req.params.id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
}

exports.plate = async(req, res) => {

}



