const express = require('express')
const authController = require('../controller/authController')
const { verifyJWT } = require('../middleware/JWTActions')
const JWTController = require("../controller/JWTController")

const route = express.Router()

const initApiRoutes = (app) => {
    route.all('*', verifyJWT)

    route.get('/logout', authController.logout)
    route.get('/account', JWTController.getAccount)

    return app.use('/api/v1', route)
}

module.exports = initApiRoutes
