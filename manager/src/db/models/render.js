module.exports = function(DB, DataTypes) {

	const Render = DB.define('render', {

		url: {
			type: DataTypes.STRING,
			allowNull: false
		},

		ver: {
			type: DataTypes.STRING,
			allowNull: false
		},

		options: {
			type: DataTypes.STRING,
			allowNull: true
		},

		formats: {
			type: DataTypes.STRING,
			allowNull: true
		}

	})

	Render.associate = function(models) {

		Render.belongsTo(models.Client, {
			onDelete: 'CASCADE',
			foreignKey: { allowNull: false }
		})

	}

	return Render
}