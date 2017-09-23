const Crypto = require('crypto')
const pub = require('../libs/pub')
const DB = require('../db')

const RABBITMQ_RENDER_QUEUE = process.env.RABBITMQ_RENDER_QUEUE
const RABBITMQ_RESULT_QUEUE = process.env.RABBITMQ_RESULT_QUEUE

module.exports = async function(wsid, ws, mq, args) {

	console.log('Manager: Create rendering request')
	console.log(args)

	const key = args.key
	const url = args.url
	const ver = args.ver

	var client = await DB.Client.find({

		where: {
			key: key
		}

	})

	if (client == null) {
		throw new Error('Invalid API Key')
	}

	var domains = await DB.Domain.findAll({

		where: {
			clientId: client.id
		}

	})

	var render = await DB.Render.find({

		where: {
			url: url,
			ver: ver
		}

	})

	if (render) {

		var formats = await DB.Format.findAll({

			where: {
				renderId: render.id
			}

		})

		var action = JSON.stringify({
			type: 'RENDER_COMPLETE',
			data: {
				id: render.id,
				url: render.url,
				ver: render.ver,
				options: JSON.parse(render.options),
				formats: JSON.parse(render.formats),
				results: formats.map(format => pub.url('renders/' + format.file))
			}
		})

		ws.send(action)
		return
	}

	var options = args.options || {}
	var formats = args.formats || ['1280']

	render = await DB.Render.create({
		url: url,
		ver: ver,
		options: JSON.stringify(options),
		formats: JSON.stringify(formats),
		clientId: client.id
	})

	for (var frmt of formats) {

		const file = Crypto.createHash('md5').update(url + ver).digest('hex') + '-' + frmt + '.png'

		await DB.Format.create({
			type: frmt,
			file: file,
			renderId: render.id
		})

	}

	var task = JSON.stringify({
		id: render.id,
		url: render.url,
		ver: render.ver,
		options: options,
		formats: formats,
		wsid: wsid
	})

	await mq.sendToQueue(RABBITMQ_RENDER_QUEUE, new Buffer(task), {persistent: true})
}