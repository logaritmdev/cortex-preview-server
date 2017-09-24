const fs = require('fs')
const path = require('path')
const amqp = require('amqplib')
const WebSocket = require('ws')
const DB = require('./src/db')

//------------------------------------------------------------------------------
// Process
//------------------------------------------------------------------------------

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
		await amqp.close()
		await chan.close()
		process.exit()
	})
}

//------------------------------------------------------------------------------
// Socket
//------------------------------------------------------------------------------

var wsc = []
var wss = null

;(async function() {

	const actions = {
		CREATE_RENDER: require('./src/actions/create-render'),
		DELETE_RENDER: require('./src/actions/delete-render'),
	}

	wss = new WebSocket.Server({port: 8080})

	wss.on('connection', async (ws, req) => {

		const id = wsc.length

		wsc.push(ws)

		ws.on('message', message => {

			var action = JSON.parse(message)
			if (action == null) {
				return
			}

			var runner = actions[action.type]
			if (runner) {
				runner(id, ws, chan, action.data)
			}
		})
	})

})()

//------------------------------------------------------------------------------
// Message Queue
//------------------------------------------------------------------------------

var conn = null
var chan = null

;(async function() {

	const RABBITMQ_HOST = process.env.RABBITMQ_HOST
	const RABBITMQ_USER = process.env.RABBITMQ_USER
	const RABBITMQ_PASS = process.env.RABBITMQ_PASS
	const RABBITMQ_RENDER_QUEUE = process.env.RABBITMQ_RENDER_QUEUE
	const RABBITMQ_RESULT_QUEUE = process.env.RABBITMQ_RESULT_QUEUE

	conn = await amqp.connect('amqp://' + RABBITMQ_USER + ':' + RABBITMQ_PASS + '@' + RABBITMQ_HOST)
	chan = await conn.createChannel()

	await chan.assertQueue(RABBITMQ_RESULT_QUEUE, {durable:true})
	await chan.assertQueue(RABBITMQ_RENDER_QUEUE, {durable:true})

	const queues = {
		RABBITMQ_RESULT_QUEUE: require('./src/queues/result-queue')
	}

	chan.consume(RABBITMQ_RESULT_QUEUE, message => queues.RABBITMQ_RESULT_QUEUE(chan, message, wss, wsc))

})()