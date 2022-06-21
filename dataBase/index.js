const dataBase = {}

const { Sequelize, Op, DataTypes } = require('sequelize')
dataBase.Operators = Op

const configData = require('./config.js') //подключаем реквизиты и конфигурацию удаленной базы данных

/*Создаем объект, через который будем взаимодествовать с БД
Передаем реквизиты БД и конфигурационные данные для подключения*/
dataBase.client = new Sequelize(
    configData.DB, 
    configData.USER, 
    configData.PASSWORD, 
    {
        host: configData.HOST,
        dialect: configData.DIALECT,
        define: {
          timestamps: false
        }
    }
)

dataBase.Users = require('./tables/users.js')(dataBase.client, DataTypes)
dataBase.Projects = require('./tables/projects.js')(dataBase.client, DataTypes)
dataBase.Houses = require('./tables/houses.js')(dataBase.client, DataTypes)
dataBase.Sections = require('./tables/sections.js')(dataBase.client, DataTypes)
dataBase.Flats = require('./tables/flats.js')(dataBase.client, DataTypes)

dataBase.Projects.hasMany(dataBase.Houses, {
  as: 'houses',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE'
})
dataBase.Houses.belongsTo(dataBase.Projects, {
  as: 'project_id'
})

dataBase.Houses.hasMany(dataBase.Sections, {
  as: 'sections',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE'
})
dataBase.Sections.belongsTo(dataBase.Houses, {
  as: 'house_id'
})

dataBase.Sections.hasMany(dataBase.Flats, {
  as: 'flats',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE'
})
dataBase.Flats.belongsTo(dataBase.Sections, {
  as: 'section_id'
})

module.exports = dataBase