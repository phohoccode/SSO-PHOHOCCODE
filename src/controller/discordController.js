require('dotenv').config()
const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport')
const { v4: uuidv4 } = require('uuid');
const socialService = require('../service/socialService')


const scopes = ['identify', 'email', 'guilds', 'guilds.join'];


const configLoginWithDiscord = () => {
    passport.use(new DiscordStrategy ({
        clientID: process.env.DISCORD_APP_CLIENT_ID,
        clientSecret: process.env.DISCORD_APP_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_APP_REDIRECT_LOGIN,
        scope: scopes,
        passReqToCallback: true
    },
        async function (req, accessToken, refreshToken, profile, cb) {

            const rawData = {
                username: profile.username,
                email: profile.email,
                type: 'DISCORD'
            }

            const user = await socialService.findOrInsertProfileSocialToDB(rawData)
            user.code = uuidv4()
            user.redirectURL = req.cookies?.redirectURL

            return cb(null, user)
        }
    ));
}


module.exports = configLoginWithDiscord
