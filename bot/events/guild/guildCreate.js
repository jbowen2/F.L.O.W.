const mysql = require('mysql');
const { Client, Guild  } = require('discord.js');
/**
 * @description Emitted bot is added to server
 * @author John W. Bowen
 * @param { Client } client 
 * @param { Guild } guild 
 */
module.exports = (client, guild) => {
    const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
    try{
        con.connect(function(err){ 
            if (err) throw err;
            con.query(`INSERT INTO guild (guild_id) VALUES ('${guild.id}');`, function(err){
                if(err) throw err;
                console.log(`joined and logged guild ${guild.name}`);
            });
        });
    }catch(err){
        console.log(err);
    }
    guild.owner.send('Our bot was just added to your server go to <Website> to finish set up');
};