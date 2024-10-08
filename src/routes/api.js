const express = require('express')

const route = express.Router()

const initApiRoutes = (app) => {
    route.get('/hello-world', (req, res) => {
        return res.json({
            message: 'Hello world'
        })
    })

    return app.use('/', route)
}

module.exports = initApiRoutes
