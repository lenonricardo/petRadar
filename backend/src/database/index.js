const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server) //todos os usuarios terão acesso aos dados em tempo real

mongoose.connect('mongodb+srv://lenonricardo:bobesponjaehgay@cluster0-dkosf.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use((req, res, next)=>{ // tudo que for depois disso, irá fazer uma nova requisição em tempo real
    req.io = io;
    next()
})

app.use(cors({origin: true, credentials: true})) //qualquer aplicação pode acessar o backend
// app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')))
//app.use(require('./routes'))
//server.listen(3334);

module.exports = mongoose;