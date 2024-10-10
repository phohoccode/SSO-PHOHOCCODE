require('dotenv').config()
const jwt = require('jsonwebtoken');

const createJWT = (payload) => {
    let token = null
    try {
        token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        return token
    } catch (error) {
        console.log(error)
    }
}

const verifyToken = (token) => {
    let decoded = null
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)   
    } catch (error) {
        console.log(error)
        decoded = 'TokenExpiredError'
    }
    return decoded     
}

module.exports = {
    createJWT,
    verifyToken
}