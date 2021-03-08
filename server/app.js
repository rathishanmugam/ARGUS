const express = require('express')
const app = express()
const api = require('./api')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
app.set('port', (process.env.PORT || 8081))

// Cross Origin middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())
app.use('/api', api)
app.use(express.static('static'))

app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('api works');
});

app.use(function (req, res, next) {
    const err = new Error('Not Found')
    err.status = 404
    res.json(err)
})
// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://database/author-article';
// Connect to mongodb
mongoose.connect(dbHost);

// mongoose.connect('mongodb://localhost:27017/author-article')
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('Connected to MongoDB')


    app.listen(app.get('port'), function () {
        console.log('API Server Listening on port ' + app.get('port') + '!')
    })
})


