module.exports = {
	server: {
		protocol: 'http://',
		hostname: 'preview.cortex.logaritm.ca', // Cortex Preview will grab images from this server
		port: ''
	},
	folder: {
		renders: '/renders'
	},
	clients: [
		{
			key: 'xsSQMSxZeYIU3sU', // A unique client key
			ips: [
				'10.10.10.10' // The server ip where the wordpress site is hosted
			]
		}
	]
}