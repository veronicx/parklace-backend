
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressValidator = require('express-validator')
const app = express()
const port = 3000

app.use(cors())
// app.use(expressValidator())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Origin, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const routes = require('./router/index');
app.use(routes);

app.get('/user/:id', (req, res) => { 
  console.log(req.params.id)
    res.send(`Hello: ${req.params.id}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})