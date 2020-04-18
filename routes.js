const express = require('express');
const route = express.Router();
const userRoute = require('./modules/index');
    
route.use('/user', userRoute)

module.exports = route;