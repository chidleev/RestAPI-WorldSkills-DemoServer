const express = require('express')
const validator = require('validator')

const dataBase = require('../dataBase')

const API = express()

API.patch('/', (req, res) => {
    const error = {
        code: 422,
        message: "Validation error",
        errors: {}
    }

    if (!req.body.flats) {
        error.errors.flats = ["Поле массива ID квартир не может быть пустым"]
    }

    if (!req.body.size) {
        error.errors.size = ["Поле площади квартир не может быть пустым"]
    }

    if (!req.body.rooms) {
        error.errors.rooms = ["Поле количества комнат в квартирах не может быть пустым"]
    }

    if (!req.body.price) {
        error.errors.price = ["Поле цены квартир не может быть пустым"]
    }

    if (Object.keys(error.errors).length) {
        res.status(error.code).json({ error })
        return
    }

    dataBase.Flats.update({
        size: req.body.size,
        rooms: req.body.rooms,
        price: req.body.price
    }, {
        where: {
            id: {
                [dataBase.Operators.in]: req.body.flats
            }
        }
    })
        .then(flats => {
            if (flats) res.sendStatus(204)
            else res.sendStatus(404)
        })
        .catch(error => {
            error.code = 500
            error.message = "Не удалось обновить данные о квартирах"
            res.status(error.code).json({ error })
        })
})

API.patch('/:flatId', (req, res) => {
    const error = {
        code: 422,
        message: "Validation error",
        errors: {}
    }

    if (!req.body.status) {
        error.errors.status = ["Поле статуса квартиры не может быть пустым"]
    }

    if (Object.keys(error.errors).length) {
        res.status(error.code).json({ error })
        return
    }

    dataBase.Flats.update({
        status: req.body.status
    }, {
        where: {
            id: req.params.flatId
        }
    })
        .then(project => {
            if (project) res.sendStatus(204)
            else res.sendStatus(404)
        })
        .catch(error => {
            error.code = 500
            error.message = "Не удалось записать данные об изменении проекта"
            res.status(error.code).json({ error })
        })
})

module.exports = API