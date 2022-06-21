module.exports = function(client, DataTypes) {
    return client.define("Sections", {
        number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        floors: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        flats_on_floor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        starting_flat_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}