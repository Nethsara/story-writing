const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')

router.get('/', ensureGuest, (req, res) => {
    res.render('Login',
        {
            layout: 'login'
        })
})

router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('Dashboard')
    console.log(req.user)
})
module.exports = router