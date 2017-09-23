const Crypto = require('crypto')
const pub = require('../libs/pub')
const DB = require('../db')

const RABBITMQ_RENDER_QUEUE = process.env.RABBITMQ_RENDER_QUEUE
const RABBITMQ_RESULT_QUEUE = process.env.RABBITMQ_RESULT_QUEUE

module.exports = async function(wsid, ws, mq, args) {

	console.log('Manager: Delete rendering request')
	console.log(args)

}