const mysql = require('mysql');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
const { Client, GuildMember  } = require('discord.js');
const drawReport = require('../../commands/system/drawReport');
/**
 * 
 * @param { Client } client 
 * @param { GuildMember } member
 */
module.exports = (client, member) => {
    con.query(`DELETE FROM user WHERE Discord_id = '${member.id}' AND guild_id = '${member.guild.id}'`,(err) => { if(err) throw err; });
    setTimeout(drawReport(), 3000);
}