require('dotenv').config()
const authService = require('../service/authService')
const nodemailer = require("nodemailer");
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const getPageLogin = (req, res) => {
    const redirectURL = req.query.redirectURL
    return res.render('login.ejs', { redirectURL })
}

const getPageRegister = (req, res) => {
    return res.render('register.ejs')
}

const login = async (req, res) => {
    try {

        const data = await authService.handleLogin(req.body)

        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: -1,
            EM: 'Lỗi không xác định!'
        })
    }
}

const register = async (req, res) => {
    try {

        const data = await authService.handleRegister(req.body)

        return res.status(200).json({
            EC: data.EC,
            EM: data.EM
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: -1,
            EM: 'Lỗi không xác định!'
        })
    }
}

const sendOTP = async (req, res) => {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000)

        const filePath = path.join(
            __dirname,
            req.body.type === 'register' ? '../templates/register.html' : '../templates/register.html'
        );

        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);

        const replacements = {
            email: process.env.GOOGLE_APP_EMAIL,
            otp: OTP
        };

        const htmlToSend = template(replacements);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GOOGLE_APP_EMAIL,
                pass: process.env.GOOGLE_APP_PASSWORD,
            },
        });

        try {

            await transporter.sendMail({
                from: `phohoccode <${process.env.GOOGLE_APP_EMAIL}>`,
                to: `${req.body.email}`,
                subject: "Xác minh tài khoản",
                text: "phohoccode",
                html: htmlToSend
            });

            await authService.insertCodeToDB(req.body.email, OTP, req.body.type)

            return res.status(200).json({
                EC: 0,
                EM: 'Đã gửi mã xác nhận. Vui lòng kiểm tra email của bạn!'
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: -1,
                EM: 'Lỗi không xác định!'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: -1,
            EM: 'Lỗi không xác định!'
        })
    }
}

const logout = (req, res, next) => {
    try {
        res.clearCookie("refresh_token");
        res.clearCookie("access_token");
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
        return res.status(200).json({
            mesage: 'Đăng xuất thành công!'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EC: -1,
            EM: 'Lỗi không xác định!'
        })
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const data = await authService.handleResetPassword(req.body)


        return res.status(200).json({
            EC: data.EC,
            EM: data.EM,
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
    getPageLogin,
    getPageRegister,
    login,
    logout,
    register,
    sendOTP,
    forgotPassword
}