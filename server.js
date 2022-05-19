const cors = require('cors')
const express = require('express')
const path = require('path')

const API = require('./API.js')

const serverApp = express()
serverApp.locals.PORT = process.env.PORT || 3030

serverApp.use(express.json())
serverApp.use(express.urlencoded({ extended: true }))

serverApp.use(cors({
    origin: '*'
}))

serverApp.use('/api', API)

serverApp.use((req, res, next) => {
    if (req.url.indexOf('.') == -1) {
        req.url = '/'
    }
    next()
})

serverApp.use('/', express.static(path.join(__dirname, 'public')))

serverApp.listen(serverApp.locals.PORT, () => {
    console.log(`Server running on port ${serverApp.locals.PORT}`)
})