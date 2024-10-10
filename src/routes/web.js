const express = require('express')
const passport = require('passport');

const checkAuthentication = require('../middleware/checkAuthentication')
const authController = require('../controller/authController')
const passportController = require('../controller/passportController')
const JWTController = require('../controller/JWTController')

const route = express.Router()

const initWebRoutes = (app) => {

    route.get('/', checkAuthentication, (req, res) => {
        return res.render('home.ejs')
    })

    route.get('/login', checkAuthentication, authController.getPageLogin)
    route.get('/register', authController.getPageRegister)
    route.post('/register', authController.register)
    route.post('/send-otp', authController.sendOTP)
    route.post('/forgot-password', authController.forgotPassword)
    route.post('/login', passportController.handleLogin)
    route.post('/logout', passportController.handleLogout);
    route.post('/verifycation-token', JWTController.verifySSOToken)

    return app.use('/', route)
}

module.exports = initWebRoutes
