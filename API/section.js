const express = require('express')

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

    dataBase.Sections.create(req.body)
        .then(section => {
            const flatsObjects = []
            for (let i = 0; i < req.body.floors; i++) {
                for (let j = 0; j < req.body.flats_on_floor; j++) {
                    flatsObjects.push({
                        floor: i+1,
                        status: 'free',
                        flat_number: req.body.starting_flat_number + j + i * req.body.flats_on_floor,
                        size: 0,
                        rooms: 0,
                        price: 0
                    })
                }
            }
            dataBase.Flats.bulkCreate(flatsObjects)
                .then(flats => {
                    section.addFlats(flats)
                        .then(section => {
                            dataBase.Houses.findByPk(req.body.house_id)
                                .then(house => {
                                    Promise.all([house.addSection(section), house.addFlats(flats)])
                                        .then(values => {
                                            res.json({
                                                data: {
                                                    id: section.id
                                                }
                                            })
                                        })
                                        .catch(error => {
                                            console.log(error);
                                            error.code = 500
                                            error.message = "Не удалось добавить квартиры или подъезд в дом"
                                            res.status(error.code).json({ error })
                                        })
                                })
                                .catch(error => {
                                    console.log(error);
                                    error.code = 500
                                    error.message = "Не удалось получить дом"
                                    res.status(error.code).json({ error })
                                })
                        })
                        .catch(error => {
                            console.log(error);
                            error.code = 500
                            error.message = "Не удалось добавить квартиры в подъезд"
                            res.status(error.code).json({ error })
                        })
                })
                .catch(error => {
                    console.log(error);
                    error.code = 500
                    error.message = "Не удалось создать квартиры"
                    res.status(error.code).json({ error })
                })
        })
        .catch(error => {
            console.log(error);
            error.code = 500
            error.message = "Не удалось создать подъезд"
            res.status(error.code).json({ error })
        })
})

API.get('/:sectionId', (req, res) => {
    dataBase.Sections.findByPk(req.params.sectionId, {
        attributes: ['id', 'number'],
        include: [{
            model: dataBase.Flats,
            as: 'flats',
            attributes: {
                exclude: ['sectionId', 'sectionIdId', 'HouseId', 'houseIdId']
            }
        }]
    })
        .then(section => {
            if (section) {
                res.json({
                    data: section
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