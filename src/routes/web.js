const express = require('express')
const authController = require('../controller/authController')

const route = express.Router()

const initWebRoutes = (app) => {
    
    route.get('/', (req, res) => {
        return res.render('home.ejs')
    })

    route.get('/login', authController.getPageLogin)
    route.get('/register', authController.getPageRegister)

    route.post('/register', authController.register)

    route.post('/verification-code', authController.verifycationCode)

    return app.use('/', route)
}

module.exports = initWebRoutes
