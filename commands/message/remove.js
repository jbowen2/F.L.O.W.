const mysql = require('mysql');
const { Message, GuildMember} = require('discord.js');
const { mysqlserver } = require('../../configs/config.json');
module.exports = {
	name: 'remove',
	description: 'remove users to db',
	args: true,
    /**
     * 
     * @param { Message } message
     * @param { string[] } args
     */
	execute(message, args) {
        /**
         * 
         * @param { GuildMember } member 
         * @param { mysql.Connection } con 
         */
        const remove = (member, con) =>{
            con.query(`DELETE FROM message WHERE Discord_id = '${member.id}'`, function (err, result, fields) { if (err) throw err;
                con.query(`DELETE FROM users WHERE Discord_id = '${member.id}'`, function (err, result, fields) { if (err) throw err;});
                console.log(`${member.displayName} has been reoved from DB`);
            });
        }
        const con = mysql.createConnection(mysqlserver);
        message.delete();
        if(args[0].startsWith('<@&')){
            const role = message.guild.roles.resolve(args[0].slice(3,-1));
            con.connect( function(err) { if (err) throw err;
                role.members.each(function(member){ remove(member, con)});
            });         
        }
        else if(args[0].startsWith('<@')){
            args[0] = args[0].slice(3,-1)
            if (args[0].startsWith('!')) {
                args[0] = args[0].slice(1);
            }
            const member = message.guild.members.resolve(args[0]);
            con.connect( function(err) { if (err) throw err;
                remove(member, con);
            });      
        }
        
    },
};