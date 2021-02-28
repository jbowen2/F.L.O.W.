const mysql = require('mysql');
const { Message, MessageEmbed } = require('discord.js');
const { mysqlserver } = require('../../configs/config.json');
module.exports = {
	name: 'users',
	description: 'sends a reply with the name of all users in db',
	args: false,
  /**
   * @name report
   * @description Creates new report
   * @author John W Bowen
   * @param { Message } message 
   */
  execute(message) {
    const con = mysql.createConnection(mysqlserver);
    const guild = message.guild;
   
    con.connect( function(err) { if (err) throw err;
        con.query(`SELECT * FROM users ORDER BY Discord_id DESC`, function (err, result, fields) { if (err) throw err;
            let row = '';
            result.forEach(user => { 
                const member = guild.members.resolve(user.Discord_id);
                row += `${member.displayName}\n`;
            });
            if(row == '') row = 'No users in DB'
            const embed = new MessageEmbed()
                .setTitle('Users in DB')
                .addField('USERS',row);
            message.reply('',embed);
        });
    });     

  },
}