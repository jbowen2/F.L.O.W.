const mysql = require('mysql');
const { Message } = require('discord.js');
const { lisener, tracker, teamMember, rowLength } = require('../../configs/ref.json');
const { mysqlserver } = require('../../configs/config.json');
module.exports = {
	name: 'reject',
	description: 'for rejecting Progress reports',
	args: true,
    /**
     * 
     * @param { Message } message
     * @param { string[] } args
     */
	execute(message, args) {
        const con = mysql.createConnection(mysqlserver);
        const reportChannel = message.guild.channels.resolve(lisener);
        message.delete();
        if(args[0].startsWith('<@')){
            args[0] = args[0].slice(3,-1)
            if (args[0].startsWith('!')) {
                args[0] = args[0].slice(1);
            }
            const guild = message.guild;
            const member = guild.members.resolve(args[0]);
            con.connect( function(err) {
                if (err) throw err;
                con.query(`UPDATE users SET has_posted = false WHERE Discord_id= '${member.id}'`,function (err, result, fields) { if (err) throw err;
                    reportChannel.send(`${member} Your Progress Report was Rejected`);
                    console.log(`${member.displayName}'s report was rejected by ${guild.members.resolve(message.author.id).displayName}`);
                    require('../../drawreport.js')(con,message);
                });
                con.query(`SELECT Message_id FROM message WHERE Discord_id = '${member.id}' ORDER BY Created_at DESC`, function(err, result, fields) { if (err) throw err;
                    con.query(`DELETE FROM message WHERE Message_id = '${result[0].Message_id}'`, function(err, result, fields) {});  
                });
            });
        }        
    },
};