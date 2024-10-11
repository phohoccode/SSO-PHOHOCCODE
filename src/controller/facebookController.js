require('dotenv').config()
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport')
const { v4: uuidv4 } = require('uuid');
const socialService = require('../service/socialService')

const configLoginWithFacebook = () => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_APP_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_APP_REDIRECT_LOGIN,
        profileFields: ['id', 'emails', 'name', 'displayName']
    },
        async function (accessToken, refreshToken, profile, cb) {

            const rawData = {
                username: profile.displayName,
                email: profile?.emails[0]?.value,
                type: 'FACEBOOK'
            }

            const user = await socialService.findOrInsertProfileSocialToDB(rawData)
            user.code = uuidv4()

            return cb(null, user)
        }
    ));
}

module.exports = configLoginWithFacebook
