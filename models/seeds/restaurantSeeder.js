const mongoose = require('mongoose')
const Restaurant = require('../restaurantModel.js')
const restaurantSeeds = require('../../restaurant.json')

mongoose.connect('mongodb://localhost/restaurants', { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB error!')
})

db.once('open', () => {
  console.log('MongoDb connected!')
})


restaurantSeeds.results.forEach(item => {
  Restaurant.create(item)
})
