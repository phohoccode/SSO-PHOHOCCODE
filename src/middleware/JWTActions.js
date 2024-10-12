const JWTService = require('../service/JWTService')

const nonSecurePaths = ['/logout', '/login', '/register', '/verifycation-token'];

const verifyJWT = async (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();

    const accessToken = req.cookies?.access_token
    const refreshToken = req.cookies?.refresh_token

    const decoded = JWTService.verifyToken(accessToken)

    if (!refreshToken) {
        return res.status(405).json({
            EC: -1,
            EM: 'Token đã hết hạn. Vui lòng đăng nhập lại!'
        })
    }

    if (accessToken && decoded !== 'TokenExpiredError') {

        req.user = {
            ...decoded,
            access_token: accessToken,
            refresh_token: refreshToken
        }

        next()
    } else {
        const response = await JWTService.findUserByToken(refreshToken)


        if (+response.EC === -1) {
            return res.status(401).json({
                EC: response.EC,
                EM: response.EM
            })
        }

        const payload = {
            username: response.DT.username,
            email: response.DT.email,
            gender: response.DT.gender,
            phoneNumber: response.DT.phoneNumber,
            address: response.DT.address,
            type: response.DT.type,
        }

        const accessToken = JWTService.createJWT(payload)

        req.user = {
            ...payload,
            access_token: accessToken,
            refresh_token: refreshToken
        }

        // set cookies
        JWTService.insertTokenToCookies(res, accessToken, refreshToken)

        return res.status(401).json({
            EC: -1,
            EM: 'Phiên đăng nhập đã hết hạn!'
        })
    }
}

module.exports = {
    verifyJWT
}