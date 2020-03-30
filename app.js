const express = require("express");

const app = express();


app.use((req, res, next) => {
  console.log('Hello World');
  
});

module.exports = app;
