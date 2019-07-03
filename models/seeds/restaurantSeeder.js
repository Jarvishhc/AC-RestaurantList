const mongoose = require('mongoose')
const Restaurant = require('../restaurantModel.js')
const restaurantSeeds = require('../../restaurant.json').results
const User = require('../usersModel.js')
const bcrypt = require('bcryptjs')

const userSeeds = [
  {
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    email: 'user2@example.com',
    password: '12345678'
  }
]

mongoose.connect('mongodb://localhost/restaurants', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB error!')
})

db.once('open', () => {
  console.log('MongoDb connected!')
})

// Create 2 users
for (let i = 0; i < userSeeds.length; i++) {
  // bcrypt password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(userSeeds[i].password, salt, (err, hash) => {
      if (err) throw err
      const newUser = new User({
        name: 'User' + (i + 1),
        email: userSeeds[i].email,
        password: hash
      })

      newUser.save().then(user => {
        // Distribute default restaurants
        for (let x = 0 + i * 3; x < (i + 1) * 3; x++) {
          let newRestaurant = new Restaurant(restaurantSeeds[x])

          if (x < 3) {
            newRestaurant.userId = user._id
          }

          if (x >= 3 && x < 6) {
            newRestaurant.userId = user._id
          }

          newRestaurant.save(err => {
            if (err) return console.error(err)
          })
        }
      })
    })
  })
}

