const Crypto = require('crypto')
const Puppeteer = require('puppeteer')

const RABBITMQ_RENDER_QUEUE = process.env.RABBITMQ_RENDER_QUEUE
const RABBITMQ_RESULT_QUEUE = process.env.RABBITMQ_RESULT_QUEUE

module.exports = async function(chan, message) {

	var render = JSON.parse(message.content.toString())
	if (render == null) {
		chan.ack(message)
		return
	}

	var browser = await Puppeteer.launch({
		args: ['--no-sandbox']
	})

	console.info('Renderer: Begin rendering')
	console.info(render)

	render.results = []

	for (var format of render.formats) {

		const url = render.url
		const ver = render.ver

		const hash = Crypto.createHash('md5').update(url + ver).digest('hex')

		var w = 0
		var h = 0

		switch (typeof format) {

			case 'string':
				var size = format.split('x')
				w = size[0] || 1
				h = size[1] || 1
				break

			case 'number':
				w = format
				h = 1
		}

		const dest = `/tmp/${hash}-${w}-${h}.jpg`

		w = parseInt(w)
		h = parseInt(h)

		const viewport = {
			width: w,
			height: h
		}

		const screenshot = {
			path: dest,
			fullPage: true
		}

		try {

			const page = await browser.newPage()
			await page.setViewport(viewport)
			await page.goto(url)
			await page.screenshot(screenshot)

			render.results.push(dest)

		} catch (error) {

			render.results.push(null)

		}
	}

	await browser.close()

	console.info('Renderer: Completed rendering')

	await chan.ack(message)
	await chan.sendToQueue(RABBITMQ_RESULT_QUEUE, new Buffer(JSON.stringify(render)), {persistent: true})
}