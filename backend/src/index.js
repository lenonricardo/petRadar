const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const { config } = require('process')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')))

app.use(session({
    secret: 'petRadar',
    saveUninitialized: false,
    resave: false
}))

require('./app/controller/index')(app)

app.listen(process.env.PORT || 3333)