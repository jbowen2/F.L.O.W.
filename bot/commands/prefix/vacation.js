const mysql = require('mysql');
const { Message } = require('discord.js');
module.exports = {
	name: 'vacation',
	description: 'For aproving and ending vacation',
	args: true,
    /**
     * 
     * @param { Message } message
     * @param { string[] } args
     */
	execute(message, args) {
        message.delete();
        const con = mysql.createConnection(process.env.MYSQLSERVER);
        if(args[0].startsWith('<@')){
            args[0] = args[0].slice(3,-1)
            if (args[0].startsWith('!')) {
                args[0] = args[0].slice(1);
            }
            const member = message.guild.members.resolve(args[0]);
            con.query(`SELECT vacation_channel_id FROM guild WHERE guild_id = '${message.guild.id}'`,function(err, result){
                if (err) throw err;
                const channel = message.guild.channels.resolve(result[0].Vacation_channel_id);
                con.query(`SELECT * FROM users WHERE discord_id = '${member.id}' AND guild_is = '${message.guild.id}'`, function (err, result) {
                    if (err) throw err;
                    if(result[0].Vacation){
                        channel.send(`${member} is no longer on vacation`);
                        console.log(`${member.displayName} is no longer on vacation`);
                        con.query(`UPDATE users SET Vacation = false WHERE Discord_id= '${member.id}' AND guild_is = '${message.guild.id}'`,function (err) {if (err) throw err;});
                    } else {
                        channel.send(`${member} is on vacation`);
                        console.log(`${member.displayName} is on vacation`);
                        con.query(`UPDATE users SET Vacation = true WHERE Discord_id = '${member.id}' AND guild_is = '${message.guild.id}'`,function (err) {if (err) throw err;});
                    }     
                });
            });       
        }
    },
};