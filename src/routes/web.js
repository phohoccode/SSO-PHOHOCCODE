const express = require('express')
const passport = require('passport');

const authController = require('../controller/authController')
const checkAuthentication = require('../middleware/checkAuthentication')
const passportController = require('../controller/passportController')

const route = express.Router()

const initWebRoutes = (app) => {

    route.get('/', checkAuthentication, (req, res) => {
        return res.render('home.ejs')
    })

    route.get('/login', checkAuthentication, authController.getPageLogin)
    route.get('/register', authController.getPageRegister)
    route.post('/register', authController.register)
    route.post('/verification-code', authController.verifycationCode)
    route.post('/login', passportController.handleLogin)
    route.post('/logout', passportController.handleLogout);




    return app.use('/', route)
}

module.exports = initWebRoutes
