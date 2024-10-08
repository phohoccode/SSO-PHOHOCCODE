const db = require('../models/index')
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password, salt) => {
    return bcrypt.hashSync(password, salt)
}

const checkPassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword)
}

const handleVerificationCode = async (email, code) => {
    try {

        await db.VerificationCodes.destroy({
            where: { email: email }
        })
        
        await db.VerificationCodes.create({
            email: email,
            code: code,
            isUse: false
        })
    } catch (error) {
        console.log(error)
        return {
            EC: -1,
            EM: 'Lỗi không xác định!'
        }
    }
}

const handleLogin = async (rawData) => {

}

const handleRegister = async (rawData) => {
    try {

        const email = await db.Users.findOne({
            where: { email: rawData.email },
            raw: true
        })


        if (email) {
            return {
                EC: -1,
                EM: 'Email đã tồn tại!',
            }
        }

        const user = await db.VerificationCodes.findOne({
            where: { email: rawData.email },
            raw: true
        })


        if (!user || user.code !== rawData.code) {
            return {
                EC: -1,
                EM: 'Mã xác nhận không chính xác!',
            }
        }

        if (user.isUse) {
            return {
                EC: -1,
                EM: 'Mã đã được sử dụng!',
            }
        }

        const hashPassword = hashUserPassword(rawData.password)

        await db.Users.create({
            username: rawData.username,
            email: rawData.email,
            password: hashPassword,
            gender: rawData.gender,
            isLock: false,
            phoneNumber: "",
            address: "",
            type: 'LOCAL'
        })

        return {
            EC: 0,
            EM: 'Đăng ký tài khoản thành công!',
        }
    } catch (error) {
        console.log(error)
        return {
            EC: -1,
            EM: 'Lỗi không xác định!'
        }
    }
}

module.exports = {
    handleLogin,
    handleRegister,
    handleVerificationCode
}