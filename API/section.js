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

    if (!req.body.house_id) {
        error.errors.house_id = ["Поле ID дома не может быть пустым"]
    }

    if (!req.body.number) {
        error.errors.number = ["Поле номера подъезда не может быть пустым"]
    }

    if (!req.body.floors) {
        error.errors.floors = ["Поле количества этажей подъезда не может быть пустым"]
    }

    if (!req.body.flats_on_floor) {
        error.errors.flats_on_floor = ["Поле количества квартир на этаже подъезда не может быть пустым"]
    }

    if (!req.body.starting_flat_number) {
        error.errors.starting_flat_number = ["Поле номера с которого начинается нумерация квартир не может быть пустым"]
    }

    if (Object.keys(error.errors).length) {
        res.status(error.code).json({ error })
        return
    }

    
})

module.exports = API