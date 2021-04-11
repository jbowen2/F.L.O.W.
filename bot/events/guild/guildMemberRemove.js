const mysql = require('mysql');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
const { Client, GuildMember  } = require('discord.js');
const { drawReport } = require('../../commands/system/system');
/**
 * 
 * @param { Client } client 
 * @param { GuildMember } member
 */
module.exports = (client, member) => {
    if(!member) return;
    try{
        const guild = member.guild;
        con.query(`DELETE FROM user WHERE Discord_id = '${member.id}' AND guild_id = '${guild.id}'`,(err) => { 
            if(err) throw err;
            drawReport(guild); 
        });
    }catch(err){console.log(err);}
    
}