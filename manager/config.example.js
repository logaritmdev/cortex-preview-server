module.exports = {

	/**
	 * Whether the WebSocket server uses SSL.
	 */
	ssl: false,

	/**
	 * The URL where renders are stored.
	 */
	renders: {
		protocol: 'http://',
		hostname: '192.168.11.115',
		port: '',
		path: '/renders'
	},

	/**
	 * Clients to create on startup.
	 */
	clients: [
		{key: 'Dev', name: 'Dev'}
	]
}