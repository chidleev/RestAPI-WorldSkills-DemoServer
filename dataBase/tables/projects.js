module.exports = function(client, DataTypes) {
    return client.define("Projects", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        coords: {
            type: DataTypes.STRING,
            allowNull: false
        },
        district: {
            type: DataTypes.STRING,
            allowNull: false
        },
        website: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}