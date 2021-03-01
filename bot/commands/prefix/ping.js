const { Message } = require('discord.js');
module.exports = {
	name: 'ping',
	description: 'Ping!',
	/**
	 * 
	 * @param { Message } message 
	 */
	execute(message) {
		message.reply('pong');
	},
};
