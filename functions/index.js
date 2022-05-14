const users = require('../dataStore').users

module.exports.project = require('./project.js')

module.exports.checkAuthorization = function (req, res, next) {
    if (isNaN(+req.headers["authorization"])) {
        res.status(403).json({
            "error": {
                "code": 403,
                "message": "Вы должны авторизоваться",
            }
        })
    }
    else next()
}

module.exports.login = function (req, res) {
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

    const user = users.find(user => user.login == req.body.login)
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
}