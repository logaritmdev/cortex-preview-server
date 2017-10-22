const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const HOSTNAME = process.env.MYSQL_HOSTNAME
const DATABASE = process.env.MYSQL_DATABASE
const USERNAME = process.env.MYSQL_USER
const PASSWORD = process.env.MYSQL_PASS

const database = new Sequelize(
	DATABASE,
	USERNAME,
	PASSWORD, {
		logging: false,
		host: HOSTNAME,
		dialect: 'mysql',
		dialectOptions: {
			multipleStatements: true
		}
	}
)

var models = {
	'Client': 'client',
	'Render': 'render',
	'Format': 'format'
}

Object.keys(models).forEach(name => {

	var model = database.import(path.join(__dirname, 'models', models[name]))
	if (model == null) {
		throw new Error('Cannot import ' + name)
	}

	database[name] = model

})

Object.keys(models).forEach(key => {

	var model = database[key]
	if (model.associate) {
		model.associate(database)
	}

})

/**
 * Importing clients
 */
Promise.resolve()

	.then(() => database.query('SET FOREIGN_KEY_CHECKS = 0'))
	.then(() => database.sync({force: process.env.NODE_ENV === 'development'}))
	.then(() => database.query('SET FOREIGN_KEY_CHECKS = 1'))

	.then(async function() {

		const config = require('../../config')

		const DB = database

		for (var data of config.clients) {

			var client = await DB.Client.find({

				where: {
					key: data.key
				}

			})

			if (client == null) {
				client = await DB.Client.create({
					key: data.key,
					name: data.name
				})
			}
		}

	}, function(err) {
		console.log(err)
	});

module.exports = database
