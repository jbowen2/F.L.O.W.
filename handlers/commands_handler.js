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
	const commandFiles = fs.readdirSync('./commands/message').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`../commands/message/${file}`);
		if(command.name) { client.commands.set(command.name, command); }
		else { continue; }
	}

	console.log("All Prefix Commands Loaded"); //logs to the console that all commands were loaded sucesfuly
};