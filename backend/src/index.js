const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')))

require('./app/controller/index')(app)

app.listen(process.env.PORT || 3333)