module.exports = function(client, DataTypes) {
    return client.define("Flats", {
        floor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        flat_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        size: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        },
        rooms: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    })
}