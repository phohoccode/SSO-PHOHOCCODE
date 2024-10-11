require('dotenv').config()
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport')
const { v4: uuidv4 } = require('uuid');
const socialService = require('../service/socialService')

const configLoginWithGithub = () => {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_APP_CLIENT_ID,
        clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_APP_REDIRECT_LOGIN
    },
        async function (accessToken, refreshToken, profile, cb) {

            const rawData = {
                username: profile.displayName,
                email: profile?.emails[0]?.value,
                address: profile?._json?.location,
                type: 'GITHUB'
            }

            const user = await socialService.findOrInsertProfileSocialToDB(rawData)
            user.code = uuidv4()

            return cb(null, user)
        }
    ));
}

module.exports = configLoginWithGithub
