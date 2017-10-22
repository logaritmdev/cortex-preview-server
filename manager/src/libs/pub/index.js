const renders = require('../../../config').renders

var pub = [
	renders.protocol,
	renders.hostname,
	renders.port ? (':' + port) : '',
	renders.path,
	'/'
].join('')

module.exports = {
	url: function(url) {
		return pub + url.replace(/^\//, '')
	}
}
