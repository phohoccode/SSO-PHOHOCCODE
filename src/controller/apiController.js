const apiService = require('../service/apiService')
const JWTService = require('../service/JWTService')

const updateUser = async (req, res) => {
    try {

        const data = await apiService.handleUpdateUser(req.body)

        const payload = {
            username: data.DT.username,
            email: data.DT.email,
            gender: data.DT.gender,
            phoneNumber: data.DT.phoneNumber,
            address: data.DT.address,
            type: data.DT.type,
        }

        const accessToken = JWTService.createJWT(payload)

        req.user = {
            ...payload,
            access_token: accessToken,
            refresh_token: data.DT.refreshToken
        }

        // set cookies
        JWTService.insertTokenToCookies(res, accessToken, data.DT.refreshToken)

        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: {
                ...data.DT,
                accessToken: accessToken
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

const getAccount = (req, res, next) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                EC: -1,
                EM: 'Không tồn tại người dùng'
            })
        }

        return res.status(200).json({
            username: req.user.username,
            email: req.user.email,
            gender: req.user.gender || '',
            phoneNumber: req.user.phoneNumber || '',
            address: req.user.address || '',
            access_token: req.user.access_token,
            refresh_token: req.user.refresh_token,
            type: req.user.type
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
    updateUser,
    getAccount
}