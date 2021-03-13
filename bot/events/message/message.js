const mysql = require('mysql');
const { Client, Message } = require('discord.js');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
/**
 * @description Emitted whenever a message is created
 * @author John W. Bowen
 * @param { Client } client 
 * @param { Message } message 
 */
module.exports = (client, message) => {
	const guild = message.guild;
	if(!guild) return;
	const member = message.guild.members.resolve(message.author.id);
	con.query(`SELECT * FROM guild WHERE guild_id = ${message.guild.id}`, async function(err, result) {
		if(err) throw err;
		const prefix = await result[0].prefix;
		if( message.content.startsWith(prefix) && !message.author.bot && (member.hasPermission('ADMINISTRATOR')||member.hasPermission('MANAGE_GUILD'))){
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
		} else if ( !message.author.bot && result[0].progress_channel_id && message.channel == guild.channels.resolve(result[0].progress_channel_id) ){
			con.query(`
				INSERT INTO users (Discord_id, Name, Vacation, has_posted)
				VALUES ('${author.id}', '${author.displayName}', false, true)
				ON DUPLICATE KEY UPDATE
				Name = '${author.displayName}',
				Vacation = false,
				has_posted = true`, function (err, result, fields) { 
				if (err) throw err;
				require('../../commands/system')(con,message,true);


			});
		} else if( message.author.bot && result[0].report_channel_id && message.channel == guild.channels.resolve(result[0].report_channel_id)){//runs when a new report is created
			con.connect( function(err) { if (err) throw err;
				con.query(`INSERT INTO tracker (Message_id) VALUES ('${message.id}')`, function (err, result, fields) { if (err) throw err; });
			});
		}
	});
};