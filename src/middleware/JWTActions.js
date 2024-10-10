const { verifyToken } = require('../service/JWTService')


const nonSecurePaths = ['/logout', '/login', '/register', '/verifycation-token'];


const verifyJWT = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();

    const accessToken = req.cookies.access_token
    const refreshToken = req.cookies.refresh_token

    // if (!accessToken) {
    //     return res.status(400).json({
    //         EC: -1,
    //         EM: 'Không tồn tại token!',
    //         DT: ''
    //     })
    // }

    const decoded = verifyToken(accessToken)

    console.log(decoded)

    if (!decoded) {
        return res.status(400).json({
            EC: -1,
            EM: 'Token không hợp lệ'
        })
    }

    req.user = {
        ...req.user,
        access_token: accessToken,
        refresh_token: refreshToken
    }

    next()

}

module.exports = {
    verifyJWT
}