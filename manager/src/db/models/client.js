module.exports = function(DB, DataTypes) {

	const Client = DB.define('client', {

		uid: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},

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