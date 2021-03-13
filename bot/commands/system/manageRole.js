const mysql = require('mysql');
const { Guild } = require('discord.js');
const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
/**
 * 
 * @param { String } roleID 
 * @param { Guild } guild 
 */
module.exports = (roleID,guild) =>{
    const role = guild.roles.resolve(roleID);
    con.query(`DELETE FROM user WHERE guild_id = '${guild.id}'`,(err) => { if(err) throw err; });
    role.members.forEach((member) => {
        con.query(`INSERT INTO user (Discord_id, Guild_id) VALUES ('${member.id}', '${guild.id}') ON DUPLICATE KEY Discord_id=Discord_id`,(err) =>{ if(err) throw err;});
    });
}