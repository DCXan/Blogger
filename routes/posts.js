const express = require('express')
const postRouter = express.Router()

postRouter.get('/', (req, res) => {

    // get all the posts from the database 
    db.any('SELECT post_id, title, body, date_created, date_updated, is_published FROM posts ORDER BY date_created DESC')
    .then(posts => {
        res.render('index', {posts: posts})
    }).catch(error => {
        // res.render('index', {message: 'Unable to get data!'})
        console.log(error)
    })
})

postRouter.post('/create', (req, res) => {

    const title = req.body.title
    const post = req.body.body

    // db.none(`INSERT INTO posts (title, body) VALUES ('${title}', '${post}')`)

    db.none('INSERT INTO posts (title, body) VALUES ($1, $2)', [title, post])
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
    
    db.none('DELETE FROM posts WHERE post_id = ($1)', [id])

    // db.none(`DELETE FROM posts WHERE post_id = ${id}`)

    res.redirect('/posts')
})

postRouter.post('/update/:postID', (req, res) => {
    const id = req.params.postID

    db.one('SELECT post_id, title, body, date_created, date_updated, is_published FROM posts WHERE post_id = ($1)', [id])
    .then(post => {
        res.render('update-post', {post})
    })
})

postRouter.post('/update', (req, res) => {
    const id = parseInt(req.body.postID)
    const title = req.body.title
    const post = req.body.body

    db.none('UPDATE posts SET title = ($1), body = ($2), date_updated = current_timestamp WHERE post_id = ($3)', [title, post, id])
    
    res.redirect('/posts')
    
})

module.exports = postRouter