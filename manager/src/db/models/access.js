module.exports = function(DB, DataTypes) {

	const Access = DB.define('access', {

		ip: {
			type: DataTypes.STRING,
			allowNull: false
		}

	})

	Access.associate = function(models) {

		Access.belongsTo(models.Client, {
			onDelete: 'CASCADE',
			foreignKey: { allowNull: false }
		})

	}

	return Access
}