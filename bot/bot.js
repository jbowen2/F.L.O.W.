
/**
 * @description Main for a Discord bot using Discord.js
 * @author John W. Bowen
 */
const { Client, Collection } = require('discord.js');

const client = new Client(); //The main hub for interacting with the Discord API, and the starting point for any bot.

//This is used throughout discord.js rather than Arrays for anything that has an ID, for significantly improved performance and ease-of-use.
client.commands = new Collection(); //A Map with the prefix commands. 
client.events = new Collection(); //A Map with the event methods. 

['commands_handler', 'events_handler'].forEach(handler =>{ require(`./handlers/${handler}`)(client); }); //For each Handler runs passing client

client.login(); //Logs the client in, establishing a websocket connection to Discord.