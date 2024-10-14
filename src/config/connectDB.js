const { Sequelize } = require('sequelize');
require('dotenv').config()

// kết nối db clever clound
const sequelize = new Sequelize(
    process.env.DB_CLEVER_CLOUD_NAME,
    process.env.DB_CLEVER_CLOUD_USERNAME,
    process.env.DB_CLEVER_CLOUD_PASSWORD, {
    host: process.env.DB_CLEVER_CLOUD_HOST,
    dialect: process.env.DB_CLEVER_CLOUD_DIALECT
})

// kiểm tra kết nối
const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối database thành công!');
    } catch (error) {
        console.error('Kết nối database thất bại!', error);
    }
}

module.exports = connection

