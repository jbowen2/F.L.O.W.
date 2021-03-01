const mysql = require('mysql');
const { Message, Client } = require('discord.js');
module.exports = {
	name: 'update',
	description: 'To update guild preferences',
	/**
     * 
     * @param { Message } message
     * @param { string[] } args
     */
	execute(message,args) {
        const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
		if(args[0] == 'prefix'){
            if(!args[1] && !( args[1].startsWith('<') || args[1].startsWith('#') || args[1].startsWith('@'))){
                message.reply('no valide prefix provide');
            } else {
                con.query(`UPDATE guild SET prefix = '${args[1]}' WHERE guild_id = '${message.guild.id}'`,function(err, result, fields){
                    if (err) throw err;
                    console.log(`prefix updated on guild ${message.guild.name} to ${args[1]}`);
                    message.reply(` The prefix has been updates to **${args[1]}**`);
                });
            }
        }
	},
};
