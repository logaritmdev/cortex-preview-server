const fs = require('fs')
const tmp = require('tmp')
const path = require('path')
const amqp = require('amqplib')


var conn = null
var chan = null
var browser = null

/**
 * Error Logging
 */

process.on('uncaughtException', function(err) {
   console.error(err.message)
   console.error(err.stack)
});

process.on('unhandledRejection', function(err) {
	console.error(err.message)
	console.error(err.stack)
})

if (process.env.NODE_ENV === 'production') {
	process.on('SIGINT', async function() {
		await chan.close()
		await conn.close()
		await browser.close()
		process.exit()
	})
}

/**
 * Starts Consumer Process
 */

;(async function() {

	console.log('Rendering process started...')

	const RABBITMQ_HOST = process.env.RABBITMQ_HOST
	const RABBITMQ_USER = process.env.RABBITMQ_USER
	const RABBITMQ_PASS = process.env.RABBITMQ_PASS
	const RABBITMQ_RENDER_QUEUE = process.env.RABBITMQ_RENDER_QUEUE
	const RABBITMQ_RESULT_QUEUE = process.env.RABBITMQ_RESULT_QUEUE

	conn = await amqp.connect('amqp://' + RABBITMQ_USER + ':' + RABBITMQ_PASS + '@' + RABBITMQ_HOST)
	chan = await conn.createChannel()
	await chan.assertQueue(RABBITMQ_RESULT_QUEUE, {durable:true})
	await chan.assertQueue(RABBITMQ_RENDER_QUEUE, {durable:true})

	var queues = {
		RABBITMQ_RENDER_QUEUE: require('./src/queues/render-queue')
	}

	chan.prefetch(1)
	chan.consume(RABBITMQ_RENDER_QUEUE, message => queues.RABBITMQ_RENDER_QUEUE(chan, message))

})()