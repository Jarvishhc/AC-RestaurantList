const express = require('express')
const router = express.Router()
const User = require('../models/usersModel')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// Login page
router.get('/login', (req, res) => {
  res.render('login')
})

// Login validation
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })(req, res, next)
})

// Register page
router.get('/register', (req, res) => {
  res.render('register')
})

// Register validation
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  let errors = []

  if (password !== confirmPassword) {
    errors.push({ message: '密碼輸入錯誤' })
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  } else {
    // Check whether user already exists
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了' })
        console.log(errors)

        res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      } else {
        const newUser = new User({
          name,
          email,
          password
        })

        // bcrypt password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash

            newUser
              .save()
              .then(user => {
                res.redirect('/')
              }).catch(err => console.log(err))
          })
        })
      }
    })
  }
})

// Logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '登出成功')
  res.redirect('/users/login')
})

module.exports = router
