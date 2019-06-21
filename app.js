const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurantModel.js')

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
  Restaurant.find({ id: req.params.id }, (err, target) => {
    if (err) return console.error(err)
    res.render('show', { restaurant: target[0] })
    console.log(target)
  })
})

// Show search results
app.get('/search', (req, res) => {
  const regex = RegExp(req.query.keyword, 'i')
  const results = restaurantList.results.filter(item => {
    return regex.test(item.name) || regex.test(item.category)
  })
  console.log(req.query.keyword)
  res.render('index', { restaurants: results, keyword: req.query.keyword })
})

// Start listening on the Express server
app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`)
})
