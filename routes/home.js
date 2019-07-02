const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurantModel.js')
const { authenticated } = require('../config/auth')

// Home page 
router.get('/', authenticated, (req, res) => {
  Restaurant.find({ userId: req.user._id }, (err, allRestaurants) => {
    if (err) return console.error(err)
    return res.render('index', { restaurants: allRestaurants })
  })
})

module.exports = router
