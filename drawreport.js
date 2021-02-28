const mysql = require('mysql');
const { Message } = require('discord.js');
const { tracker, vacation, teamMember, length } = require('./configs/ref.json');
/**
 * 
 * @param { mysql.Connection } con 
 * @param { Message } message 
 */
module.exports = (con,message) =>{
    console.log('report was drawn');
    const guild = message.guild;
    const author = guild.members.resolve(message.author.id);
	
    con.query('SELECT * FROM tracker ORDER BY Created_at DESC', async function (err, result, fields) {
        if (err) throw err;
        const trackerPost = await guild.channels.resolve(tracker).messages.fetch(result[0].Message_id);
        const trackerDate = new Date(result[0].Created_at);
        const trackerEnd = new Date(trackerDate.getDate()+6);
        con.query(`INSERT INTO message (Message_id, Discord_id, Tracker_id) VALUES (${message.id},${author.id},${result[0].Message_id})`, function (err, result, fields) { if (err) throw err;
            let report = `Weekly Check for the week of the ${trackerDate.getMonth()+1}/${trackerDate.getDate()} - ${trackerEnd.getMonth()+1}/${trackerEnd.getDate()}\n[${guild.roles.resolve(teamMember)}]                         [Date of Recent Post]\n`;
            con.query(`SELECT * FROM users u ORDER BY Discord_id DESC`, async function (err, result, fields) { if (err) throw err;
                for(const user of result){
                    let row = ` ${guild.members.resolve(user.Discord_id)} `;
                    let rowLength = 2+author.displayName.length;
                    while (rowLength < length) {
                        row += '-';
                        rowLength++;
                    }
                    //if a user has posted there latest post is taken places as time of report
                    if(user.has_posted){
                        con.query(`
                            SELECT m.Created_at
                            FROM users u, message m
                            WHERE m.Created_at > ${trackerDate.toISOString().slice(0, 10)}
                            AND u.Discord_id = ${user.Discord_id}
                            AND u.Discord_id = m.Discord_id
                            ORDER BY m.Created_at DESC`, function (err, result, fields) { if (err) throw err;
                            const postDate = new Date(result[0].Created_at);
                            report += row + ` Progress ${postDate.getMonth()+1}/${postDate.getDate()}\n`;
                        });
                    } else if(user.Vacation){ 
                        report += row+` ${guild.channels.resolve(vacation)}\n`;
                    } else { 
                        report += row+' No report Submited\n';
                    }                          
                }
                //delays the report frombeing edited for 3 secs to allow the report to be writen
                
                setTimeout( async function() { trackerPost.edit(report);}, 3000);
            });
        });
    });
}