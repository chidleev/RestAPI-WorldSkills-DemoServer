module.exports = function(client, DataTypes) {
    return client.define("Houses", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        built_year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        built_quarter: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}