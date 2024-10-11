const db = require("../models")
const JWTService = require('../service/JWTService')

const handleUpdateUser = async (rawData) => {
    try {

        const rows = await db.Users.update(
            {
                username: rawData.username,
                email: rawData.email,
                phoneNumber: rawData.phoneNumber,
                gender: rawData.gender,
                address: rawData.address
            },
            { where: { email: rawData.email, type: rawData.type } }
        )


        if (rows[0] === 0) {
            return {
                EC: -1,
                EC: 'Cập nhật người dùng thất bại!',
                DT: {}
            }
        }

        const user = await db.Users.findOne({
            where: { email: rawData.email, type: rawData.type },
            raw: true
        })

        console.log('>>> user', user)

        return {
            EC: 0,
            EC: 'Cập nhật người dùng thành công!',
            DT: user
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
    handleUpdateUser
}