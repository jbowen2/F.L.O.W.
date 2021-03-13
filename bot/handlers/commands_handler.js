const { Client } = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
/**
 * @name commands_handler
 * @description Method loads message base prefix commands in to the command collection
 * @author John W. Bowen
 * @param { Client } client 
 */
module.exports = (client) =>{
	const commandFiles = fs.readdirSync('./bot/commands/prefix').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`../commands/prefix/${file}`);
		if(command.name) { client.commands.set(command.name, command); }
		else { continue; }
	}
};