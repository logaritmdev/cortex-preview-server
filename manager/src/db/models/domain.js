module.exports = function(DB, DataTypes) {

	const Domain = DB.define('domain', {

		name: {
			type: DataTypes.STRING,
			allowNull: false
		}

	})

	Domain.associate = function(models) {

		Domain.belongsTo(models.Client, {
			onDelete: 'CASCADE',
			foreignKey: { allowNull: false }
		})

	}

	return Domain
}