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
	'Domain': 'domain',
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

	// .then(() => database.query('SET FOREIGN_KEY_CHECKS = 0'))
	// .then(() => database.sync({ force: true }))
	// .then(() => database.query('SET FOREIGN_KEY_CHECKS = 1'))

	// .then(async function() {

	// 	const configs = require('../../config')

	// 	for (var data of configs.clients) {

	// 		var client = await database.Client.create({
	// 			key: data.key,
	// 			uid: data.uid
	// 		})

	// 		for (var domain of data.domains) {
	// 			await database.Domain.create({
	// 				name: domain,
	// 				clientId: client.id
	// 			})
	// 		}

	// 	}

	// }, function(err) {
	// 	console.log(err)
	// });

module.exports = database
