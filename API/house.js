const express = require('express')
const validator = require('validator')

const dataBase = require('../dataBase')

const API = express()

API.post('/', (req, res) => {
    const error = {
        code: 422,
        message: "Validation error",
        errors: {}
    }

    
    
    
    
    
    
    built_quarter

    if (!req.body.project_id) {
        error.errors.project_id = ["Поле ID объекта не может быть пустым"]
    }

    if (!req.body.name) {
        error.errors.name = ["Поле названия дома не может быть пустым"]
    }

    if (!req.body.address) {
        error.errors.address = ["Поле адреса объекта не может быть пустым"]
    }

    if (!req.body.built_year) {
        error.errors.built_year = ["Поле сайта объекта не может быть пустым"]
    }
    else if (!validator.isURL(req.body.website)) {
        error.errors.website = ["Поле сайта объекта должно быть ссылкой"]
    }

    if (Object.keys(error.errors).length) {
        res.status(error.code).json({ error })
        return
    }

    dataBase.Projects.create(req.body)
        .then(project => {
            res.json({
                data: {
                    id: project.id
                }
            })
        })
        .catch(error => {
            error.code = 500
            error.message = "Не удалось записать данные о новом проекте"
            res.status(error.code).json({ error })
        })
})

module.exports = API