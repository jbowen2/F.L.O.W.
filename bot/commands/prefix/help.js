const mysql = require('mysql');
const { Message, Client, MessageEmbed } = require('discord.js');
module.exports = {
	name: 'help',
	description: 'tells user all commands',
	args: false,
    /**
     * 
     * @param { Message } message
     * @param { string[] } args
     * @param { Client } client
     */
	execute(message, args, client) {
        let embed = new MessageEmbed().setTitle('Command List');
        client.commands.each(command => {
            embed = embed.addField(command.name,command.description);
        });
        message.reply('',embed);
    },
}