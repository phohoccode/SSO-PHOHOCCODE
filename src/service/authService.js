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

const checkExistEmail = async (emailUser) => {
    try {
        const email = await db.Users.findOne({
            where: { email: emailUser, type: 'LOCAL' },
            raw: true
        })

        return email ? true : false
    } catch (error) {
        console.log(error)
        return {
            EC: -1,
            EM: 'Lỗi không xác định!'
        }
    }
}

const insertCodeToDB = async (email, code, type) => {
    try {

        const user = await db.VerificationCodes.findOne({
            where: { email: email, type: type }
        })

        if (!user) {
            const response = await db.VerificationCodes.create({
                email: email,
                code: code,
                type: type
            })

            if (response?.isNewRecord) {
                return {
                    EC: -1,
                    EM: 'Thêm mã xác thực thất bại!'
                }
            } else {
                return {
                    EC: 0,
                    EM: 'Thêm mã xác thực thành công!'
                }
            }
        }

        const rows = await db.VerificationCodes.update(
            { code: code },
            {where: {email: email, type: type}}
        )

        if (rows[0] > 0) {
            return {
                EC: 0,
                EM: 'Cập nhật mã thành công!'
            }
        } else {
            return {
                EC: -1,
                EM: 'Cập nhật mã thất bại!'
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

        if (+user.isLock === 1) {
            return {
                EC: -1,
                EM: 'Tài khoản đã bị khoá!'
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
        const email = await checkExistEmail(rawData.email)

        if (email) {
            return {
                EC: -1,
                EM: 'Email đã tồn tại!',
            }
        }

        const user = await db.VerificationCodes.findOne({
            where: { email: rawData.email, type: rawData.type },
            raw: true
        })

        if (!user || user.code !== rawData.code) {
            return {
                EC: -1,
                EM: 'Mã xác nhận không chính xác!',
            }
        }

        const hashPassword = hashUserPassword(rawData.password, salt)

        const response = await db.Users.create({
            username: rawData.username,
            email: rawData.email,
            password: hashPassword,
            gender: rawData.gender,
            isLock: false,
            phoneNumber: "",
            address: "",
            type: 'LOCAL'
        })

        if (response?.isNewRecord) {
            return {
                EC: 0,
                EM: 'Đăng ký tài khoản thất bại!',
            }
        }

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

const handleResetPassword = async (rawData) => {
    try {
        const isEmailExist = await checkExistEmail(rawData.email)

        if (!isEmailExist) {
            return {
                EC: -1,
                EM: 'Địa chỉ email không tồn tại!'
            }
        }

        const user = await db.VerificationCodes.findOne({
            where: { email: rawData.email, type: rawData.type },
            raw: true
        })


        if (!user || user.code !== rawData.code) {
            return {
                EC: -1,
                EM: 'Mã xác nhận không chính xác!',
            }
        }

        const hashPassword = hashUserPassword(rawData.password)

        const rows = await db.Users.update(
            { password: hashPassword },
            { where: { email: rawData.email } }
        )

        if (rows[0] === 0) {
            return {
                EC: -1,
                EM: 'Thay đổi mật khẩu thất bại!'
            }
        }

        return {
            EC: 0,
            EM: 'Thay đổi mật khẩu thành công!'
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
    insertCodeToDB,
    checkExistEmail,
    handleResetPassword
}