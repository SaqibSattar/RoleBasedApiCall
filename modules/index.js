const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

var User = require('../models/user');


router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
      if(user.length >= 1) {
         res.status(409).json({
          Message: 'Mail exist.'
        });
      } else {
        bcryptjs.hash(req.body.password, 10, (err, hash) => {
          if (err) {
          return  res.status(500).json({
              error: err
            });
          } else {
            var user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
           
              password: hash
            });
            user.save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                Message: 'User successfully added.'
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              })
            });
          }
        });
      }
    });
  });

 router.post('/login', (req, res, next) => {
  User.find({email: req.body.email})
  .exec()
  .then(user => {
    if (user.length < 1){
      return res.status(401).json({
        Error: 'Auth Failed.'
      });
    }
    bcryptjs.compare(req.body.password, user[0].password, (err, result) => {
      if (err){
        return res.status(401).json({
          Error: 'Auth Failed.'
        });
      }
      if (result) {
        // process.env.JWT_KEY;
        var token = jwt.sign({
          email: user[0].email,
          userId: user[0]._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: '1h'
        }
      );
        return res.status(200).json({
          Message: 'Auth Successful.',
          token: token
        });
      }
      res.status(401).json({
        Error: 'Auth Failed.'
      });
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  })
});

module.exports = router;