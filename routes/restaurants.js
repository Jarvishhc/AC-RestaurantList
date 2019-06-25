const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurantModel.js')

// Show search results
router.get('/search', (req, res) => {
  const regex = RegExp(req.query.keyword, 'i')
  Restaurant.find((err, allRestaurants) => {
    if (err) return console.error(err)
    const results = allRestaurants.filter(item => {
      return regex.test(item.name) || regex.test(item.category)
    })
    res.render('index', { restaurants: results, keyword: req.query.keyword })
  })
})

router.get('/sorting', (req, res) => {
  const regex = RegExp(req.query.keyword, 'i')
  const sortBy = Object.keys(req.query)[0]
  const sortValue = req.query[sortBy]
  const sortObject = {}

  sortObject[sortBy] = sortValue

  Restaurant.find()
    .sort(sortObject)
    .exec((err, allRestaurants) => {
      if (err) return console.error(err)

      const results = allRestaurants.filter(item => {
        return regex.test(item.name) || regex.test(item.category)
      })
      return res.render('index', { restaurants: results, keyword: req.query['keyword'] })
    })

})

// Show 'create restaurant' page
router.get('/new', (req, res) => {
  return res.render('new')
})

// Create a restaurant
router.post('', (req, res) => {
  const newRestaurant = Restaurant()
  Object.assign(newRestaurant, req.body)
  newRestaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect(`/restaurants/${newRestaurant._id}`)
  })
})

// Show restaurant details
router.get('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, target) => {
    if (err) return console.error(err)
    res.render('show', { restaurant: target })
  })
})

// Show restaurant's edit page
router.get('/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, target) => {
    if (err) return console.error(err)
    res.render('edit', { restaurant: target })
  })
})

// Edit restaurant
router.put('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, target) => {
    if (err) return console.error(err)
    Object.assign(target, req.body)
    target.save(err => {
      if (err) return Console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})

// Delete a restaurant
router.delete('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, target) => {
    if (err) return console.error(err)
    target.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })

  })
})

module.exports = router
