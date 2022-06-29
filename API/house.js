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
        error.errors.built_year = ["Поле года сдачи не может быть пустым"]
    }
    else if ((req.body.built_year < 1000) || (req.body.built_year > 9999)) {
        error.errors.built_year = ["Поле года сдачи должно быть четырехзначным числом"]
    }

    if (!req.body.built_quarter) {
        error.errors.built_quarter = ["Поле квартала сдачи не может быть пустым"]
    }
    else if ((req.body.built_quarter < 1) || (req.body.built_quarter > 4)) {
        error.errors.built_quarter = ["Поле квартала сдачи должно быть больше 1 и меньше 4"]
    }

    if (Object.keys(error.errors).length) {
        res.status(error.code).json({ error })
        return
    }

    dataBase.Projects.findByPk(req.body.project_id)
    .then(project => {
        if (project) {
            dataBase.Houses.create(req.body)
            .then(house => {
                project.addHouse(house)
                .then(project => {
                    res.json({
                        data: {
                            id: house.id
                        }
                    })
                })
                .catch(error => {
                    error.code = 500
                    error.message = "Не удалось записать данные о новом доме"
                    res.status(error.code).json({ error })
                })
            })
            .catch(error => {
                error.code = 500
                error.message = "Не удалось записать данные о новом доме"
                res.status(error.code).json({ error })
            })
        }
        else {
            error.code = 404
            error.errors.project_id = ["Нет проекта с таким ID"]
            res.status(error.code).json({ error })
        }
    })
    .catch(error => {
        error.code = 500
        error.message = 'Sequelize Error'
        res.status(error.code).json({ error })
    })
})

API.get('/:houseId', (req, res) => {
    dataBase.Houses.findByPk(req.params.houseId, {
        attributes: {
            exclude: ['ProjectId', 'projectIdId']
        },
        include: [{
            model: dataBase.Sections,
            as: 'sections',
            attributes: ['id', 'number']
        }]
    })
        .then(house => {
            if (house) {
                res.json({
                    data: house
                })
            }
            else res.sendStatus(404)
        })
        .catch(error => {
            error.code = 500
            error.message = "Не удалось получить данные о доме"
            res.status(error.code).json({ error })
        })
})

API.patch('/:houseId', (req, res) => {
    const error = {
        code: 422,
        message: "Validation error",
        errors: {}
    }
    
    if (!req.body.name) {
        error.errors.name = ["Поле названия дома не может быть пустым"]
    }

    if (!req.body.address) {
        error.errors.address = ["Поле адреса объекта не может быть пустым"]
    }

    if (!req.body.built_year) {
        error.errors.built_year = ["Поле года сдачи не может быть пустым"]
    }
    else if ((req.body.built_year < 1000) || (req.body.built_year > 9999)) {
        error.errors.built_year = ["Поле года сдачи должно быть четырехзначным числом"]
    }

    if (!req.body.built_quarter) {
        error.errors.built_quarter = ["Поле квартала сдачи не может быть пустым"]
    }
    else if ((req.body.built_quarter < 1) || (req.body.built_quarter > 4)) {
        error.errors.built_quarter = ["Поле квартала сдачи должно быть больше 1 и меньше 4"]
    }

    if (Object.keys(error.errors).length) {
        res.status(error.code).json({ error })
        return
    }

    dataBase.Houses.update(req.body, {
        where: {
            id: +req.params.houseId //плюс впереди стоит для того, чтобы сделать из строки число
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

API.get('/:houseId/flats', (req, res) => {
    dataBase.Houses.findByPk(req.params.houseId, {
        attributes: [],
        include: [{
            model: dataBase.Flats,
            as: 'flats',
            attributes: {
                exclude: ['HouseId', 'houseIdId', 'sectionId', 'sectionIdId']
            },
            include: [{
                model: dataBase.Sections,
                attributes: ['id', 'number', 'floors', 'flats_on_floor']
            }]
        }]
    })
        .then(house => {
            if (house) {
                res.json({
                    data: house
                })
            }
            else res.sendStatus(404)
        })
        .catch(error => {
            error.code = 500
            error.message = "Не удалось получить данные о доме"
            res.status(error.code).json({ error })
        })
})

module.exports = API