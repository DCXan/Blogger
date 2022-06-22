const express = require('express')
const app = express()

// initializing pg promise 
const pgp = require('pg-promise')() 
const connectionString = 'postgres://hmnapnij:G_rg81-yECF0Q4w6EERvLuV5y0oIlChP@isilo.db.elephantsql.com/hmnapnij'
global.db = pgp(connectionString)

app.use(express.urlencoded({extended: true}))

const postRouter = require('./routes/posts')
app.use('/posts', postRouter)

const mustacheExpress = require('mustache-express')

// setting up Express to use Mustache Express as template pages 
app.engine('mustache', mustacheExpress())
    // the pages are located in views directory
app.set('views', './views')
    // extension will be .mustache
app.set('view engine', 'mustache')

app.use(express.static('public'))

let port = 8000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
