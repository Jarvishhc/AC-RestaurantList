const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurantModel.js')

// Home page 
router.get('/', (req, res) => {
  Restaurant.find((err, allRestaurants) => {
    if (err) return console.error(err)
    return res.render('index', { restaurants: allRestaurants })
  })
})

module.exports = router
