const fs = require('fs')
const path = require('path')
const pub = require('../libs/pub')
const DB = require('../db')

module.exports = async function(chan, message, wss, wsc) {

	var render = JSON.parse(message.content.toString())
	if (render == null) {
		chan.ack(message)
		return
	}

	console.log('Manager: Received completion message for')
	console.log(render)

	var formats = render.formats
	var results = render.results
	var options = render.options

	for (var i = 0; i < formats.length; i++) {

		var format = formats[i]
		var result = results[i]

		if (result == null) {
			continue
		}

		format = await DB.Format.find({

			where: {
				type: format,
				renderId: render.id
			}

		})

		if (format == null) {
			continue
		}

		format.completed = true
		format.completedDate = new Date()
		await format.save()

		var dest = path.join(__dirname, '../../renders', format.file)

		fs.createReadStream(result).pipe(
			fs.createWriteStream(dest)
		)

		results[i] = pub.url('renders/' + format.file)

		try {
			s.unlinkSync(result)
		} catch(e) {

		}
	}

	var ws = wsc[render.wsid]
	if (ws) {

		var action = JSON.stringify({
			type: 'RENDER_COMPLETE',
			data: {
				id: render.id,
				url: render.url,
				ver: render.ver,
				options: render.options,
				formats: render.formats,
				results: results
			}
		})

		ws.send(action)

		console.log('Manager: Notified client')
	}

	chan.ack(message)
}
