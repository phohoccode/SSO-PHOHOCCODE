const checkAuthentication = (req, res, next) => {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        (req.path === '/login') ? res.redirect('/') : next()
    } else {
        (req.path === '/login') ? next() : res.redirect('/login')
    }
}

module.exports = checkAuthentication