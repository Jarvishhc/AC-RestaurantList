const express = require('express')
const router = express.Router()
const User = require('../models/usersModel')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// Login
router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router
