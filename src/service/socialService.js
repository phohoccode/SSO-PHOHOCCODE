const db = require('../models')

const findOrInsertProfileSocialToDB = async (rawData) => {
    try {
        let user = null

        user = await db.Users.findOne({
            where: { email: rawData.email, type: rawData.type },
            raw: true
        })

        if (!user) {
            user = await db.Users.create({
                username: rawData.username,
                email: rawData.email,
                address: rawData.address || '',
                type: rawData.type
            })

            user = user.dataValues
        }

        return user
    } catch (error) {
        console.log(error)
        return {
            EC: -1,
            EM: 'Lỗi không xác định!'
        }
    }
}

module.exports = {
    findOrInsertProfileSocialToDB
}