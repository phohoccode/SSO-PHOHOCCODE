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

module.exports = {
    updateUser
}