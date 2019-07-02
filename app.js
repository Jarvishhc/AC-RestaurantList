const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurantModel.js')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Setting static files
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// Set up express session
app.use(session({
  secret: 'adjflakjfdlkajflajdf',
  resave: 'false',
  saveUninitialized: 'flase'
}))

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()

  next()
})


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

// ========== Routes setting ==========
app.use('/', require('./routes/home'))
app.use('/restaurants', require('./routes/restaurants'))
app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auths'))


// Start listening on the Express server
app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`)
})
