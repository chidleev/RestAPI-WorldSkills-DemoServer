const express = require('express')
const validator = require('validator')

const dataBase = require('../dataBase')

const API = express()

function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
        }, {})
}

API.get('/', (req, res) => {
    dataBase.Projects.findAll({
        attributes: ['id', 'name'],
        include: [{
            model: dataBase.Houses,
            as: 'houses',
            include: [{
                model: dataBase.Flats,
                as: 'flats',
                attributes: ['status']
            }]
        }]
    })
        .then(projects => {
            const allFlats = {}
            projects.forEach(project => {
                var flats = []
                project.houses.forEach(house => {
                    flats = flats.concat(house.flats)
                })
                allFlats[project.id] = flats
            });

            const statuses = {}
            const projectObjects = []
            projects.forEach(project => {
                statuses[project.id] = groupByKey(allFlats[project.id], 'status')
                projectObjects.push({
                    id: project.id,
                    name: project.name,
                    flat_statuses: {
                        "free": (statuses[project.id]['free'])? statuses[project.id]['free'].length : 0, 
                        "reserved": (statuses[project.id]['reserved'])? statuses[project.id]['reserved'].length : 0, 
                        "sold": (statuses[project.id]['sold'])? statuses[project.id]['sold'].length : 0,
                    }
                })
            })
            res.json({
                data: {
                    projects: projectObjects
                }
            })
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

API.post('/', (req, res) => {
    const error = {
        code: 422,
        message: "Validation error",
        errors: {}
    }

    if (!req.body.name) {
        error.errors.name = ["Поле названия объекта не может быть пустым"]
    }

    if (!req.body.coords) {
        error.errors.coords = ["Поле координат объекта не может быть пустым"]
    }
    else if (req.body.coords.split(',').length != 2) {
        error.errors.coords = ["Поле координат объекта должно представлять собой два десятичных числа через запятую"]
    }
    else if (isNaN(+req.body.coords.split(',')[0]) ||
        isNaN(+req.body.coords.split(',')[1])) {
        error.errors.coords = ["Поле координат объекта должно представлять собой два десятичных числа через запятую"]
    }

    if (!req.body.district) {
        error.errors.district = ["Поле района объекта не может быть пустым"]
    }

    if (!req.body.website) {
        error.errors.website = ["Поле сайта объекта не может быть пустым"]
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

API.get('/:projectId', (req, res) => {
    dataBase.Projects.findByPk(req.params.projectId, {
        include: [{
            model: dataBase.Houses,
            as: 'houses'
        }]
    })
        .then(project => {
            if (project) {
                res.json({
                    data: project
                })
            }
            else res.sendStatus(404)
        })
        .catch(error => {
            error.code = 500
            error.message = "Не удалось получить данные о проекте"
            res.status(error.code).json({ error })
        })
})


API.patch('/:projectId', (req, res) => {
    const error = {
        code: 422,
        message: "Validation error",
        errors: {}
    }

    if (!req.body.name) {
        error.errors.name = ["Поле названия объекта не может быть пустым"]
    }

    if (!req.body.coords) {
        error.errors.coords = ["Поле координат объекта не может быть пустым"]
    }
    else if (req.body.coords.split(',').length != 2) {
        error.errors.coords = ["Поле координат объекта должно представлять собой два десятичных числа через запятую"]
    }
    else if (isNaN(+req.body.coords.split(',')[0]) ||
        isNaN(+req.body.coords.split(',')[1])) {
        error.errors.coords = ["Поле координат объекта должно представлять собой два десятичных числа через запятую"]
    }

    if (!req.body.district) {
        error.errors.district = ["Поле района объекта не может быть пустым"]
    }

    if (!req.body.website) {
        error.errors.website = ["Поле сайта объекта не может быть пустым"]
    }
    else if (!validator.isURL(req.body.website)) {
        error.errors.website = ["Поле сайта объекта должно быть ссылкой"]
    }

    if (Object.keys(error.errors).length) {
        res.status(error.code).json({ error })
        return
    }

    dataBase.Projects.update(req.body, {
        where: {
            id: +req.params.projectId //плюс впереди стоит для того, чтобы сделать из строки число
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