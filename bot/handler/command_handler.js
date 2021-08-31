// eslint-disable-next-line no-unused-vars
const { Client } = require('discord.js');
const fs = require('fs');
/**
 * @name command_handler
 * @author John W. Bowen
 * @param { Client } client
 */
module.exports = (client) => {
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.data.name, command);
	}
};