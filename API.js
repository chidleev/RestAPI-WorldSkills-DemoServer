const data = require('./data.json')

const checkAuthorization = function(req, res, next) {
    if (isNaN(parseInt(req.headers["authorization"]))) {
        res.status(403).json({
            "error": {
                "code": 403,
                "message": "Вы должны авторизоваться",
            }
        })
    }
    else next()
}

const express = require("express")

const api = express()

api.get('/', (req, res) => {
    res.send("API work!")
})

api.post('/login', (req, res) => {
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
        res.status(error.code).json({error})
        return
    }

    const user = data.users.find(user => user.login == req.body.login)
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
            res.status(error.code).json({error})
        }
    }
    else {
        error.code = 401
        error.message = "Unauthorized"
        error.errors.login = ["Неверный логин"]
        res.status(error.code).json({error})
    }
})

api.get('/project', checkAuthorization, (req, res) => {
    res.json({
        data: {
            projects: data.projects
        }
    })
})


module.exports = api