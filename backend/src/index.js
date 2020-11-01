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

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

io.on('connection', socket => {
   // console.log('a user connected :D');
   // console.log(socket)
   socket.on('chat message', msg => {
     console.log(msg);
     io.emit('chat message', msg);
   });
 });

require('./app/controller/index')(app)

server.listen(3333)
// app.listen(process.env.PORT || 3333)