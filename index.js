const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: false
}));

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/docker-node-mongo', {
    // mongoose.connect('mongodb://localhost:27017/docker-node-mongo', {
    promiseLibrary: bluebird,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    // Automatically try to reconnect when it loses connection to MongoDB
    autoReconnect: true,
    // Never stop trying to reconnect
    reconnectTries: Number.MAX_VALUE,
    // Reconnect every 500ms
    reconnectInterval: 500,
    // Maintain up to 10 socket connections. If not connected,
    // return errors immediately rather than waiting for reconnect
    poolSize: 10,
    // Give up initial connection after 10 seconds
    connectTimeoutMS: 10000,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('!!!!!!!' + err))

const Item = require('./models/Item');

app.get('/', (req, res) => {
  // console.log('!!!!!connection on root detected!!!!!');

  Item.find()
    .then(items => {
      console.log('!!!!!Inside find!!!!!');
      res.render('index', {
        items
      })
    })
    .catch(err => res.status(404).json({
      msg: 'No items found'
    }));
});

app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  })
  newItem.save().then(item => res.redirect('/'))
})

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);

})