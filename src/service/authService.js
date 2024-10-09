const { Op } = require('sequelize');
const db = require('../models/index')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password, salt) => {
    return bcrypt.hashSync(password, salt)
}

const checkPassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword)
}

const checkExistEmail = async (email) => {
    try {

    } catch (error) {
        console.log(error)
        return {
            EC: -1,
            EM: 'Lỗi không xác định!'
        }
    }
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
    try {
        const user = await db.Users.findOne({
            where: {
                [Op.or]: [
                    { email: rawData.username },
                    { phoneNumber: rawData.username }
                ],
                type: 'LOCAL'
            },
            raw: true
        })

        console.log(user)

        if (!user) {
            return {
                EC: -1,
                EM: 'Tài khoản hoặc mật khẩu không chính xác!'
            }
        }

        const isCorrectPassword = checkPassword(rawData.password, user.password)

        if (!isCorrectPassword) {
            return {
                EC: -1,
                EM: 'Mật khẩu không chính xác!'
            }
        }

        return {
            EC: 0,
            EM: 'Đăng nhập thành công!',
            DT: {
                username: user.username,
                email: user.email,
                address: user.address,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                code: uuidv4()
            }
        }
    } catch (error) {
        console.log(error)
        return {
            EC: -1,
            EM: 'Lỗi không xác định!'
        }
    }
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

        const hashPassword = hashUserPassword(rawData.password, salt)

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