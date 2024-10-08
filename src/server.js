require('dotenv').config() 
const express = require('express')
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')

const connection = require('./config/connectDB')
const configCors = require('./config/cors')
const configViewEngine = require('./config/viewEngine')
const initApiRoutes = require('./routes/api')
const initWebRoutes = require('./routes/web')

const app = express()
const PORT = process.env.PORT || 8888

// test kết nối database
connection()

// config cors
configCors(app)

// config view engine
configViewEngine(app)

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config cookie-parser
app.use(cookieParser());

// init routes
initApiRoutes(app)
initWebRoutes(app)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})