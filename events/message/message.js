const mysql = require('mysql');
const { Client, Message, MessageAttachment } = require('discord.js');
const { prefix, mysqlserver } = require('../../configs/config.json');
const { lisener, tracker } = require('../../configs/ref.json');
/**
 * @description Emitted whenever a message is created
 * @author John W. Bowen
 * @param { Client } client 
 * @param { Message } message 
 */
module.exports = (client, message) => {
	const con = mysql.createConnection(mysqlserver);
	const guild = message.guild;
	const author = guild.members.resolve(message.author.id);
	
	
	//prefix command interperiter (checks: has prefix, author is not bot, and author is admin)
	if( message.content.startsWith(prefix) && !message.author.bot && author.hasPermission('ADMINISTRATOR') ){
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
	} else if ( !message.author.bot && message.channel == guild.channels.resolve(lisener) ){
		console.log(`New report from ${author.displayName}`);
		con.connect( function(err) { if (err) throw err;
			con.query(`
                INSERT INTO users (Discord_id, Name, Vacation, has_posted)
                VALUES ('${author.id}', '${author.displayName}', false, true)
                ON DUPLICATE KEY UPDATE
                Name = '${author.displayName}',
                Vacation = false,
                has_posted = true`, function (err, result, fields) { if (err) throw err;
				require('../../drawreport.js')(con,message);
			});
		});
	} else if( message.author.bot && message.channel == guild.channels.resolve(tracker)){//runs when a new report is created
		con.connect( function(err) { if (err) throw err;
			con.query(`INSERT INTO tracker (Message_id) VALUES ('${message.id}')`, function (err, result, fields) { if (err) throw err; });
		});
	}
};