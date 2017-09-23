module.exports = function(DB, DataTypes) {

	const Format = DB.define('format', {

		type: {
			type: DataTypes.STRING,
			allowNull: false
		},

		file: {
			type: DataTypes.STRING,
			allowNull: false
		},

		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},

		completedDate: {
			type: DataTypes.DATE,
			allowNull: true,
		}

	})

	Format.associate = function(models) {

		Format.belongsTo(models.Render, {
			onDelete: 'CASCADE',
			foreignKey: { allowNull: false }
		})

	}

	return Format
}