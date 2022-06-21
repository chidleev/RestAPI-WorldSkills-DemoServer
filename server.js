const path = require('path')

const cors = require('cors')
const express = require('express')

const dataBase = require('./dataBase')

const API = require('./API')

const serverApp = express()
serverApp.locals.PORT = 3000

serverApp.use(express.json())
serverApp.use(express.urlencoded({ extended: true }))

serverApp.use(cors({ origin: '*' }))

serverApp.use('/api', API)
serverApp.use('/scripts', express.static(path.join(__dirname, 'node_modules')))

serverApp.use((req, res, next) => {
    if (req.url.indexOf('.') == -1) {
        req.url = '/'
    }
    next()
})

serverApp.use(express.static(path.join(__dirname, 'public')))

dataBase.client.sync()
    .then(() => {
        serverApp.listen(serverApp.locals.PORT, () => {
            console.log(`Server running on port ${serverApp.locals.PORT}`)
        })
    })
    .catch(error => {
        console.error(error);
    })