const mysql = require('mysql');
const { Message, GuildMember } = require('discord.js');
const { mysqlserver } = require('../../configs/config.json');
module.exports = {
	name: 'add',
	description: 'add users to db',
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
        const add = (member, con) =>{
            con.query(`
                INSERT INTO users (Discord_id, Name) 
                VALUES ('${member.id}', '${member.displayName}') 
                ON DUPLICATE KEY UPDATE Name = '${member.displayName}'`, function (err, result, fields) { if (err) throw err;
                console.log(`${member.displayName} has been added to DB`);
                });
        }
        const con = mysql.createConnection(mysqlserver);
        message.delete();
        if(args[0].startsWith('<@&')){
            con.connect( function(err) {
                if (err) throw err;
                const role = message.guild.roles.resolve(args[0].slice(3,-1));
                role.members.each(function(member){ add(member,con); });
            });         
        }
        else if(args[0].startsWith('<@')){
            args[0] = args[0].slice(3,-1)
            if (args[0].startsWith('!')) {
                args[0] = args[0].slice(1);
            }
            const member = message.guild.members.resolve(args[0]);
            con.connect( function(err) {
                if (err) throw err;
                add(member,con);
            });      
        }
        
        
    },
};