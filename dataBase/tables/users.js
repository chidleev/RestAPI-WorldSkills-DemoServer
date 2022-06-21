module.exports = function(client, DataTypes) {
    return client.define("Users", {
        login: {
            type: DataTypes.STRING, //тип - строка
            allowNull: false, //разрешено ли пустое значение - нет
            unique: true //должен иметь уникальное значение - да
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}