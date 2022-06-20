const fs = require('fs')
const validUrl = require('valid-url')
const projects = require('../dataStore').projects


module.exports.getAll = function (req, res) {
    res.json({
        data: {
            projects: projects
        }
    })
}


module.exports.create = function (req, res) {
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
    else if (!validUrl.isUri(req.body.website)) {
        error.errors.website = ["Поле сайта объекта должно быть ссылкой"]
    }

    if (Object.keys(error.errors).length) {
        res.status(error.code).json({ error })
        return
    }


    const nextId = projects.length
    projects.push({
        id: nextId,
        name: req.body.name,
        coords: req.body.coords,
        district: req.body.district,
        website: req.body.website
    })

    fs.writeFile('./dataStore/projects.json', JSON.stringify(projects, null, '\t'), err => {
        if (err) {
            error.code = 500
            error.message = "Не удалось записать данные о новом проекте"
            res.status(error.code).json({ error })
            return
        }
        res.json({
            data: {
                id: nextId
            }
        })
    })
}


module.exports.getById = function (req, res) {
    const project = projects.find(project => project.id == req.params.projectId)

    if (project) {
        res.json({
            data: project
        })
    }
    else res.sendStatus(404)
}


module.exports.patchById = function (req, res) {
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
    else if (!validUrl.isUri(req.body.website)) {
        error.errors.website = ["Поле сайта объекта должно быть ссылкой"]
    }

    if (Object.keys(error.errors).length) {
        res.status(error.code).json({ error })
        return
    }

    const project = projects.find(project => project.id == req.params.projectId)

    if (project) {
        projects[projects.indexOf(project)] = {
            id: +req.params.projectId,
            name: req.body.name,
            coords: req.body.coords,
            district: req.body.district,
            website: req.body.website
        }

        fs.writeFile('./dataStore/projects.json', JSON.stringify(projects, null, '\t'), err => {
            if (err) {
                error.code = 500
                error.message = "Не удалось записать данные об изменении проекта"
                res.status(error.code).json({ error })
                return
            }
            res.sendStatus(204)
        })
    }
    else res.sendStatus(404)
}