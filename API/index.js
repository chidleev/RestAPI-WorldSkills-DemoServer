const express = require("express")

const dataBase = require('../dataBase')

const projectsAPI = require('./project.js')
const housesAPI = require('./house.js')
const sectionsAPI = require('./section.js')
const flatsAPI = require('./flat.js')

const API = express()

API.get('/', (req, res) => {
    res.send("API work!")
})

API.post('/login', (req, res) => {
    const error = {
        code: 422,
        message: "Validation error",
        errors: {}
    }

    if (!req.body.login) {
        error.errors.login = ["Поле логина не может быть пустым"]
    }
    if (!req.body.password) {
        error.errors.password = ["Поле пароля не может быть пустым"]
    }

    if (Object.keys(error.errors).length) {
        res.status(error.code).json({ error })
        return
    }

    dataBase.Users.findOne({
        where: {
            login: req.body.login
        }
    })
    .then(user => {
        if (user) {
            if (user.password == req.body.password) {
                res.json({
                    data: {
                        token: Math.round(Math.random() * 1000)
                    }
                })
            }
            else {
                error.code = 401
                error.message = "Unauthorized"
                error.errors.password = ["Неверный пароль"]
                res.status(error.code).json({ error })
            }
        }
        else {
            error.code = 401
            error.message = "Unauthorized"
            error.errors.login = ["Неверный логин"]
            res.status(error.code).json({ error })
        }
    })
    .catch(error => {
        error.code = 500
        error.message = "Ошибка Sequelize"
        res.status(error.code).json({ error })
    })
})


API.use((req, res, next) => {
    if (isNaN(+req.headers["authorization"])) {
        res.status(403).json({
            "error": {
                "code": 403,
                "message": "Вы должны авторизоваться",
            }
        })
    }
    else next()
})

API.use('/project', projectsAPI)
API.use('/house', housesAPI)
API.use('/section', sectionsAPI)
API.use('/flat', flatsAPI)

module.exports = API