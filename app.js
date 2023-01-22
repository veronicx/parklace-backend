
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressValidator = require('express-validator')
const app = express()
const port = 3000
const WebSocket = require('ws');
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });


const parkingSlots = {
  slot1: { name: 'Slot 1', size: 'large', location: 'Level 1', premiumFeatures: false },
  slot2: { name: 'Slot 2', size: 'medium', location: 'Level 2', premiumFeatures: true },
  // Add more slots as needed
};




app.use(cors({
  origin: (origin, cb) => {
    cb(null, origin && origin.startsWith('http://127.0.0.1:'));
  },
  credentials: true,
}));

require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Origin, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


const routes = require('./router/index');
app.use(routes);

wss.on('connection', (ws) => {
  console.log('connection')
  // Send the current parking slots to the client when they connect
  ws.send(JSON.stringify(parkingSlots));

  // Listen for messages from the client
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if(data.book){
    // Update the parking slots object when the client sends a message to book a slot
    parkingSlots[data.slot].booked = true;
    }else{
    parkingSlots[data.slot].booked = false;
    }
    // Send the updated parking slots to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parkingSlots));
      }
    });
  });
});


// const accountSid = process.env.SID;
// const authToken = process.env.TOKEN;
// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//      body: 'Hello from Node.js',
//      from: '+16088796962',
//      to: '+38349970385'
//    })
//   .then(message => console.log(message.sid))
//   .done();


server.listen(8080);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
