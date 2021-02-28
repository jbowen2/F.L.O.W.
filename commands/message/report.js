const mysql = require('mysql');
const { Message } = require('discord.js');
const { tracker, teamMember, length, vacation } = require('../../configs/ref.json');
const { mysqlserver } = require('../../configs/config.json');

module.exports = {
	name: 'report',
	description: 'sends new message in report chat',
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
    //Time
	  const currentDate = new Date();
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 6);
    //channels
    const reportChannel = message.guild.channels.resolve(tracker);
    //message
    let report = `Weekly Check for the week of the ${currentDate.getMonth()+1}/${currentDate.getDate()} - ${nextDate.getMonth()+1}/${nextDate.getDate()}\n[${message.guild.roles.resolve(teamMember)}]                         [Date of Recent Post]\n`;
		//mySQL
    con.connect( function(err) { if (err) throw err;
			con.query(`SELECT * FROM users ORDER BY Discord_id DESC`, function (err, result, fields) { if (err) throw err;
			  for(const user of result){
          con.query(`UPDATE users SET has_posted = false WHERE Discord_id = ${user.Discord_id}`, function (err, result, fields) { if (err) throw err; });
          let row = ` ${message.guild.members.resolve(user.Discord_id)} `;
          let rowLength = 2+guild.members.resolve(user.Discord_id).displayName.length;
					while (rowLength < length) {
					  row += '-';
						rowLength++;
          }
          if(user.Vacation != 0){report += row+` ${message.guild.channels.resolve(vacation)}\n`;}
          else{report += row+' No report Submited\n';}
        }
        reportChannel.send(report);
			});
		});
    message.delete();
    console.log('New Report Created');
  }
}