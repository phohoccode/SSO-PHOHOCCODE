const passport = require('passport');
const LocalStrategy = require('passport-local');
const authService = require('../service/authService')

const configPassport = () => {
    passport.use(new LocalStrategy(
        async function (username, password, done) {

            const res = await authService.handleLogin({ username, password })

            if (res && +res.EC === 0) {
                return done(null, res.DT);
            } else {
                return done(null, false);
            }
        }
    ));
}

const handleLogin = (req, res, next) => {
    passport.authenticate('local', function (error, user, info) {
        if (error) {
            return res.status(500).json(error);
        }

        if (!user) {
            return res.status(401).json({
                message: 'Tài khoản hoặc mật khẩu không đúng!'
            });
        }

        // Lưu thông tin người dùng vào session và cookies 
        req.login(user, function (err) {
            if (err) return next(err)
            return res.status(200).json(user)
        })

    })(req, res, next) // vào hàm configPassport
}

const handleLogout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}

module.exports = {
    configPassport,
    handleLogin,
    handleLogout
}