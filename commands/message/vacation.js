const mysql = require('mysql');
const { Message } = require('discord.js');
const { vacation } = require('../../configs/ref.json');
const { mysqlserver } = require('../../configs/config.json');
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
        const con = mysql.createConnection(mysqlserver);
        const channel = message.guild.channels.resolve(vacation);
        message.delete();
        if(args[0].startsWith('<@')){
            args[0] = args[0].slice(3,-1)
            if (args[0].startsWith('!')) {
                args[0] = args[0].slice(1);
            }
            const member = message.guild.members.resolve(args[0]);
            con.connect( function(err) {
                if (err) throw err;
                con.query(`SELECT * FROM users WHERE Discord_id= '${member.id}'`,
                function (err, result, fields) {
                    if (err) throw err;
                    if(result[0].Vacation){
                        channel.send(`${member} is no longer on vacation`);
                        console.log(`${member.displayName} is no longer on vacation`);
                        con.query(`UPDATE users SET Vacation = false WHERE Discord_id= '${member.id}'`,function (err, result, fields) {if (err) throw err;});
                    } 
                    else {
                        channel.send(`${member} is on vacation`);
                        console.log(`${member.displayName} is on vacation`);
                        con.query(`UPDATE users SET Vacation = true WHERE Discord_id= '${member.id}'`,function (err, result, fields) {if (err) throw err;});
                    }     
                });
            });      
        }  
    },
};