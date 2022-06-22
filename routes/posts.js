const express = require('express')
const postRouter = express.Router()

postRouter.get('/', (req, res) => {

    // get all the posts from the database 
    db.any('SELECT post_id, title, body, date_created, date_updated, is_published FROM posts')
    .then(posts => {
        res.render('index', {posts: posts})
    }).catch(error => {
        // res.render('index', {message: 'Unable to get data!'})
        console.log(error)
    })
})

postRouter.post('/create', (req, res) => {

    console.log(req.body)
    const title = req.body.title
    const post = req.body.body

    db.none(`INSERT INTO posts (title, body) VALUES ('${title}', '${post}')`)

    // db.none('INSERT INTO posts (title, body) VALUES ($1, $2)', [title, post])
    .then(() => {
        res.redirect('/posts')
    }).catch(error => {
        res.render('index', {message: 'Unable to post!'})
    })
})

postRouter.get('/create', (req, res) => {
    res.render('new-post')
})

postRouter.post('/delete', (req, res) => {
    const id = req.body.postID
    
    db.none(`DELETE FROM posts WHERE post_id = ${id}`)
    
    res.redirect('/posts')
})

module.exports = postRouter