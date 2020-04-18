const express = require("express");
const mongoose = require('mongoose');
const app = express();
var bodyParser = require('body-parser');

const routes = require('./routes');

mongoose.connect('mongodb://localhost:27017/FYPDB', 
{useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept, Authorization");
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'DEL, PATCH, POST, PUT, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/', routes);


app.use((req, res, next) => {
  var error = new Error('The page u request is not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message : error.message
    }
  });
});

module.exports = app;
