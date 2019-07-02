const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const mongoUrl = "mongodb://mongo:27017/docker-node-mongo";



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: false
}));

// // Connect to MongoDB
// mongoose.connect('mongodb://mongo:27017/docker-node-mongo', {
//     // mongoose.connect('mongodb://localhost:27017/docker-node-mongo', {
//     useNewUrlParser: true
//   })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log('!!!!!!!' + err))


var connectWithRetry = function () {
  return mongoose.connect(mongoUrl, function (err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};
connectWithRetry();


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