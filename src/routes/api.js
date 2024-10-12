const express = require('express')
const authController = require('../controller/authController')
const { verifyJWT } = require('../middleware/JWTActions')
const JWTController = require("../controller/JWTController")
const apiController = require('../controller/apiController')

const route = express.Router()

const initApiRoutes = (app) => {
    route.all('*', verifyJWT)

    route.get('/logout', authController.logout)
    route.get('/account', apiController.getAccount)
    route.post('/update-user', apiController.updateUser)

    return app.use('/api/v1', route)
}

module.exports = initApiRoutes
