require('dotenv').config()
const { createJWT } = require('../service/JWTService')
const { v4: uuidv4 } = require('uuid');

const verifySSOToken = (req, res, next) => {
    try {
        const ssoToken = req.body.ssoToken

        if (req.user && req.user.code && req.user.code !== ssoToken) {
            return res.status(200).json({
                EC: -1,
                EM: 'Token không hợp lệ!'
            })
        }

        const refreshToken = uuidv4()

        const payload = {
            username: req.user.username,
            email: req.user.email,
            gender: req.user.gender,
            phoneNumber: req.user.phoneNumber,
            address: req.user.address,
        }

        const token = createJWT(payload)

        res.cookie('refresh_token', refreshToken, {
            maxAge: +process.env.MAX_AGE_REFRESH_TOKEN,
            httpOnly: true
        })

        res.cookie('access_token', token, {
            maxAge: +process.env.MAX_AGE_ACCESS_TOKEN,
            httpOnly: true
        })

        const resData = {
            ...payload,
            access_token: token,
            refresh_token: refreshToken
        }



        return res.status(200).json({
            EC: 0,
            EC: 'Xác thực người dùng thành công!',
            DT: resData
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: -1,
            EM: 'Lỗi không xác định!'
        })
    }
}

const getAccount = (req, res, next) => {
    try {
        return res.status(200).json({
            username: req.user.username,
            email: req.user.email,
            gender: req.user.gender,
            phoneNumber: req.user.phoneNumber,
            address: req.user.address,
            access_token: req.user.access_token,
            refresh_token: req.user.refresh_token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: -1,
            EM: 'Lỗi không xác định!'
        })
    }
}

module.exports = {
    verifySSOToken,
    getAccount
}