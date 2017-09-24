module.exports = function(DB, DataTypes) {

	const Client = DB.define('client', {

		key: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false
		}

	})

	Client.associate = function(models) {

	}

	return Client
}