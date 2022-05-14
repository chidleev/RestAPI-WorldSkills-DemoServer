const functions = require('./functions')

const express = require("express")

const api = express()

api.get('/', (req, res) => {
    res.send("API work!")
})

api.post('/login', functions.login)


api.use(functions.checkAuthorization)


api.get('/project', functions.project.getAll)
api.post('/project', functions.project.create)

api.get('/project/:projectId', functions.project.getById)
api.patch('/project/:projectId', functions.project.patchById)



module.exports = api