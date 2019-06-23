const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurantModel.js')
const bodyParser = require('body-parser')

// Connect to MongoDB
mongoose.connect('mongodb://localhost/restaurants', { useNewUrlParser: true })

const db = mongoose.connection

// Connection error
db.on('error', () => {
  console.log('MongoDB error!')
})

// Connection success
db.once('open', () => {
  console.log('MongoDB connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// User body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// Setting static files
app.use(express.static('public'))

// ========== Routes setting ==========
// Home page 
app.get('/', (req, res) => {
  Restaurant.find((err, allRestaurants) => {
    if (err) return console.error(err)
    return res.render('index', { restaurants: allRestaurants })
  })
})

// Show restaurant details
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, target) => {
    if (err) return console.error(err)
    res.render('show', { restaurant: target })
    console.log(target)
  })
})

// Show search results
app.get('/search', (req, res) => {
  const regex = RegExp(req.query.keyword, 'i')

  Restaurant.find((err, allRestaurants) => {
    if (err) return console.error(err)
    const results = allRestaurants.filter(item => {
      return regex.test(item.name) || regex.test(item.category)
    })
    res.render('index', { restaurants: results, keyword: req.query.keyword })
  })
})

// Show restaurant's edit page
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, target) => {
    if (err) return console.error(err)
    res.render('edit', { restaurant: target })
  })
})

// Edit restaurant
app.post('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, target) => {
    if (err) return console.error(err)
    Object.assign(target, req.body)
    target.save(err => {
      if (err) return Console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})

// Show 'create restaurant' page
app.get('/new', (req, res) => {
  return res.render('new')
})

// Create a restaurant
app.post('/createRestaurant', (req, res) => {
  const newRestaurant = Restaurant()
  Object.assign(newRestaurant, req.body)
  newRestaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect(`/restaurants/${newRestaurant._id}`)
  })
})

// Delete a restaurant
app.post('/restaurants/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id, (err, target) => {
    if (err) return console.error(err)
    console.log('here ')
    target.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })

  })
})

// Start listening on the Express server
app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`)
})
