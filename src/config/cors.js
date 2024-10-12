require("dotenv").config();

const configCors = (app) => {
    app.use(function (req, res, next) {
        const corsWhitelist = process.env.REACT_URL.split(',')
    
        if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
            console.log('URL hợp lệ!')

            res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            res.setHeader('Access-Control-Allow-Credentials', true);

            if (req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }
        }

        next();
    });
}

module.exports = configCors;