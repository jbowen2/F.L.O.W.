const { Message, Guild, TextChannel, GuildMember} = require('discord.js');
const mysql = require('mysql');
const query = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER)).query;

/**
 * @param {Guild} guild
 */
function enablecheck(guild) {
    query(`SELECT enabled FROM guild WHERE guild_id = '${guild.id}'`,(err,result)=>{
        if(err) throw err;
        if(result[0].enabled == 1)
            return true;
        else
            return false;
    });
}
/**
 * @description Method will render and post/edit a report
 * @param { Guild } guild Discord guild object
 * @param { Boolean } isNew flage determing if the message is new or editing an old one
 */
function drawReport(guild, isNew = false) {
    getGuildInfo(guild,(guildInfo,users)=>{
        /**
         * @constant
         */
        const reportChannel = guild.channels.resolve(guildInfo.report_channel_id);
        if(isNew) {
            const date = new Date();
            let report = writeReport(users,date,guild,guildInfo)
            reportChannel.send(report)
        } else {
            getReport(reportChannel, (reportMessage)=>{
                let report = writeReport(users,reportMessage.createdAt,guild,guildInfo)
                reportMessage.edit(report);
            });
        }
    });
    
}
/**
 * 
 * @param { TextChannel } reportChannel
 * @param { (reportMessage: Message) } callback
 */
function getReport(reportChannel, callback) {
    query(`SELECT message_id, created_at FROM report ORDER BY Created_at DESC WHERE Guild_id = '${reportChannel.guild.id}'`,(err, result)=>{
        if(err) throw err;
        if(!result) return;
        const reportMessage = reportChannel.messages.resolve(result.message_id);
        return callback(reportMessage);
    });
}
/**
 * 
 * @param { Guild } guild 
 * @param { (guildInfo:String[], users:String[]) } callback 
 */
function getGuildInfo(guild, callback){
    query(`SELECT * FROM guild WHERE guild_id = '${guild.id}'`,(err,result)=>{
        if(err) throw err;
        if(!result) return;
        query(`SELECT discord_id, on_vacation, has_posted FROM user WHERE guild_id = '${guild.id}'`,(err,result1)=>{
            console.log(result);
            if(err) throw err;
            if(!result) return;
            return callback(result,result1);
        });
    });
}
/**
 * 
 * @param { GuildMember } user 
 * @param { Date } reportDate
 * @param { (postDate:Date)} callback 
 */
function getPostDate(user,reportDate, callback){
    query(`SELECT m.created_at FROM user AS u JOIN message AS m ON u.discord_id = m.discord_id WHERE m.created_at > ${reportDate.toISOString().slice(0, 10)} AND u.discord_id = ${user.id} AND u.guild = '${user.guild.id}' ORDER BY m.created_at DESC`,(err,result)=>{
        if(err) throw err;
        if(!result) return;
        return callback(new Date(result[0].created_at));
    });
}
/**
 * 
 * @param { Array[] } users array of users with proprties 
 * @param { Date } date Date of message
 * @param { Guild } guild
 * @param { Array[] } guildInfo array of guild properties
 * @returns String message
 */
function writeReport(users, date, guild, guildInfo){
    let report = `Weekly Check for the week of the ${date.getMonth()+1}/${date.getDate()}`;
    for(const user of users){
        const member=guild.members.resolve(user.guild_id)
        let row = ` ${member} `;
        let rowLength = 2+ member.displayName.length;
        while(rowLength < 30){
            row += ' ';
            rowLength++;
        }
        if(user.has_posted){
            getPostDate(member,(postDate)=>{
                report += row + ` Progress ${postDate.getMonth()+1}/${postDate.getDate()}\n`;
            });
        } else if(user.on_vacation && guildInfo.vacation_enabled){
            report += row+` ${guild.channels.resolve(guildInfo.vacation_channel_id)}\n`;
        } else {
            report += row+' No report Submited\n';
        }
    }
    return report;
}
module.exports = { enablecheck, drawReport };