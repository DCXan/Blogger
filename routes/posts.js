const express = require('express')
const postRouter = express.Router()

postRouter.get('/', (req, res) => {

    // get all the posts from the database 
    db.any('SELECT post_id, title, body, date_created, date_updated, is_published FROM posts')
    .then(posts => {
        res.render('index', {posts: posts})
    }).catch(error => {
        res.render('index', {message: 'Unable to get data!'})
    })
})

postRouter.post('/create', (req, res) => {

    console.log(req.body)
    const title = req.body.title
    const post = req.body.body


    db.none('INSERT INTO posts (title, body) VALUES ($1, $2)', [title, post])
    .then(() => {
        res.redirect('/posts')
    })
})

postRouter.get('/create', (req, res) => {
    res.render('new-post')
})

module.exports = postRouter