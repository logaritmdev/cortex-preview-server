const server = require('../../../config').server
const folder = require('../../../config').folder

var pub = [
	server.protocol,
	server.hostname,
	server.port ? (':' + port) : '',
	folder.render,
	'/'
].join('')

module.exports = {
	url: function(url) {
		return pub + url.replace(/^\//, '')
	}
}
