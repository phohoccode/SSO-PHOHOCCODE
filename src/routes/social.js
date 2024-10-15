require('dotenv').config()
const express = require('express')
const passport = require('passport')

const route = express.Router()

const initSocialRoutes = (app) => {

    // GOOGLE   
    route.get('/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] }));

    route.get('/google/redirect',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            return res.render('social.ejs', {
                ssoToken: req.user.code,
                redirectURL: process.env.REACT_URL,
                type: 'GOOGLE'
            })
        });


    // FACEBOOK
    route.get('/auth/facebook',
        passport.authenticate('facebook', { scope: ['email'] }));

    route.get('/facebook/redirect',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
            return res.render('social.ejs', {
                ssoToken: req.user.code,
                redirectURL: process.env.REACT_URL,
                type: 'FACEBOOK'
            })
        });

    // GITHUB
    route.get('/auth/github',
        passport.authenticate('github', { scope: ['user:email'] }));

    route.get('/github/redirect',
        passport.authenticate('github', { failureRedirect: '/login' }),
        function (req, res) {
            return res.render('social.ejs', {
                ssoToken: req.user.code,
                redirectURL: process.env.REACT_URL,
                type: 'GITHUB'
            })
        });

    route.get('/auth/discord', passport.authenticate('discord'));
    route.get('/discord/redirect', passport.authenticate('discord', {
        failureRedirect: '/'
    }), function (req, res) {
        return res.render('social.ejs', {
            ssoToken: req.user.code,
            redirectURL: process.env.REACT_URL,
            type: 'DISCORD'
        })
    });

    return app.use('/', route)
}

module.exports = initSocialRoutes
