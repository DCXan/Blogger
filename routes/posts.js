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

module.exports = postRouter