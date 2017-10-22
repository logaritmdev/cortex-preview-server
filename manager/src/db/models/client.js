module.exports = function(DB, DataTypes) {

	const Client = DB.define('client', {

		key: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		},

		name: {
			type: DataTypes.STRING,
			allowNull: false
		}

	})

	Client.associate = function(models) {

	}

	return Client
}