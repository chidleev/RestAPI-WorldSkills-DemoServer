const cors = require('cors')
const express = require('express')
const path = require('path')

const API = require('./API.js')

const serverApp = express()
serverApp.locals.PORT = process.env.PORT || 3000

serverApp.use(express.json())
serverApp.use(express.urlencoded({ extended: true }))

serverApp.use(cors({
    origin: '*'
}))

serverApp.use('/api', API)
serverApp.use('/scripts', express.static(path.join(__dirname, 'node_modules')))

serverApp.use((req, res, next) => {
    if (req.url.indexOf('.') == -1) {
        req.url = '/'
    }
    next()
})

serverApp.use('/', express.static(path.join(__dirname, 'public')))
serverApp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

serverApp.listen(serverApp.locals.PORT, () => {
    console.log(`Server running on port ${serverApp.locals.PORT}`)
})