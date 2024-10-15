require('dotenv').config()
const { createJWT } = require('../service/JWTService')
const { v4: uuidv4 } = require('uuid');
const JWTService = require('../service/JWTService')

const verifySSOToken = async (req, res, next) => {
    try {

        const ssoToken = req.body?.ssoToken

        if (req.user?.code !== ssoToken) {
            return res.status(401).json({
                EC: -1,
                EM: 'Token không hợp lệ!'
            })
        }

        const refreshToken = uuidv4()
        const response = await JWTService.insertTokenToDB(req.user.email, refreshToken, req.body.typeAccount)

        if (+response?.EC === -1) {
            return res.status(401).json({
                EC: response.EC,
                EM: response.EM
            })
        }

        const payload = {
            username: req.user.username,
            email: req.user.email,
            gender: req.user.gender,
            phoneNumber: req.user.phoneNumber,
            address: req.user.address,
            type: req.user.type
        }

        const accessToken = createJWT(payload)

        // set cookies
        JWTService.insertTokenToCookies(res, accessToken, refreshToken)

        return res.status(200).json({
            EC: 0,
            EC: 'Xác thực người dùng thành công!',
            DT: {
                ...payload,
                access_token: accessToken,
                refresh_token: refreshToken
            }
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
}