function authenticationMW(req, res, next) {
    // console.log(req.session.id)
    if (req.session) {
        if (req.session.userID) {
            next()
        } else {
            res.render('login', {loginMessage: 'You must be logged in to view this page.'})
        }
    } else {
        res.render('login', {loginMessage: 'You must be logged in to view this page.'})
    }
    // console.log('running middleware...')
    // console.log(req.session)
    // if (req.session) {
    //     if (req.session.id) {
    //         console.log(req.session.id)
    //         next()
    //     } else {
    //         res.redirect('/account/login')
    //     }
    // } else {
    //     res.redirect('/account/login')
    // }

}

module.exports = authenticationMW