const mysql = require('mysql');
const { Client, Message } = require('discord.js');
/**
 * @description Emitted whenever a message is created
 * @author John W. Bowen
 * @param { Client } client 
 * @param { Message } message 
 */
module.exports = (client, message) => {
	const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
	const guild = message.guild;
	let author = message.author;
	if(message.guild){
		author = guild.members.resolve(message.author.id);
		con.query(`SELECT prefix FROM guild WHERE guild_id = ${message.guild.id}`,async function(err, result, fields){
			if(err) throw err;
			const prefix = await result[0].prefix;
			//prefix command interperiter (checks: has prefix, author is not bot, and author is admin)
			if( message.content.startsWith(prefix) && !message.author.bot && (author.hasPermission('ADMINISTRATOR')||author.hasPermission('MANAGE_GUILD'))){
				const args = message.content.slice(prefix.length).trim().split(/ +/);// removes prfix chariter
				const command = args.shift().toLowerCase();//shfits mesage to lowercase
				if (!client.commands.has(command)) return;//checks command exsits
				//command exicution is atempted
				try {
					client.commands.get(command).execute(message, args, client);
				}
				catch (error) {
					console.error(error);
					message.reply('there was an error trying to execute that command!');
				}
			
			} 
		});
	}
	
	
	
};