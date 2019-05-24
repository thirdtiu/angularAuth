const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const mongoose = require('mongoose')
const db = "mongodb+srv://root:root@cluster0-3gokm.mongodb.net/eventsdb?retryWrites=true"

mongoose.connect(db, err => {
  if (err) {
    console.error('Error! ' + err)
  } else {
    console.log('Connected to mongodb')
  }
})

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]

  if (token === 'null') {
    return res.status(401).send('Unauthorized request')
  }

  let payload = jwt.verify(token, 'secretKey')
  if (!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}

router.get('/', (req, res) => {
  res.send('From API route')
})

router.post('/register', (req, res) => {
  let userData = req.body
  let user = User(userData)
  user.save((error, registeredUser) => {
    if (error) {
      console.log(error)
    } else {
      let payload = { subject: registeredUser._id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
    }
  })
})

router.post('/login', (req, res) => {
  let userData = req.body

  User.findOne({email: userData.email}, (error, user) => {
    if (error) {
      console.log(error)
    } else {
      if (!user) {
        res.status(401).send('Invalid Email')
      } else if ( user.password !== userData.password) {
        res.status(401).send('Invalid Password')
      } else {
        let payload =  { subject: user._id }
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})
      }
    }
  })
})

router.get('/events', (req, res) => {
  let events = [
    {
      "_id": "1",
      "name": "Auto Expo",
      "description": "Lorem Ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "2",
      "name": "Auto Expo",
      "description": "Lorem Ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "3",
      "name": "Auto Expo",
      "description": "Lorem Ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
  ]

  res.json(events)
})

router.get('/special', verifyToken, (req, res) => {
  let events = [
    {
      "_id": "1",
      "name": "Auto Expo",
      "description": "Lorem Ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "2",
      "name": "Auto Expo",
      "description": "Lorem Ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "3",
      "name": "Auto Expo",
      "description": "Lorem Ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
  ]

  res.json(events)
})

module.exports = router




// mongodb+srv://root:<password>@cluster0-3gokm.mongodb.net/test?retryWrites=true




// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://root:<password>@cluster0-3gokm.mongodb.net/test?retryWrites=true";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
