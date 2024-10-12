require('dotenv').config()
const express = require('express')
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const connection = require('./config/connectDB')
const configCors = require('./config/cors')
const configViewEngine = require('./config/viewEngine')
const initApiRoutes = require('./routes/api')
const initWebRoutes = require('./routes/web')
const initSocialRoutes = require('./routes/social')
const { configPassport } = require('./controller/passportController')
const configLoginWithGoogle = require('./controller/googleController')
const configLoginWithFacebook = require('./controller/facebookController')
const configLoginWithGithub = require('./controller/githubController')
const configLoginWithDiscord = require('./controller/discordController')
const configSession = require('./config/session')


const app = express()
const PORT = process.env.PORT || 8080

// test kết nối database
// connection()

// config cors
configCors(app)

// config view engine
configViewEngine(app)

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config cookie-parser
app.use(cookieParser());
configSession(app)

// init routes
initApiRoutes(app)
initWebRoutes(app)
initSocialRoutes(app)

configPassport()
configLoginWithGoogle()
configLoginWithFacebook()
configLoginWithGithub()
configLoginWithDiscord()

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})