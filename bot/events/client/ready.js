const mysql = require('mysql');
const { Client } = require('discord.js');
/**
 * 
 * @param { Client } client 
 */
module.exports = ( client ) => {
	const con = mysql.createConnection(JSON.parse(process.env.MYSQLSERVER));
    try{
        con.connect(function(err){ 
            if (err) throw err;
            console.log("Connection To DB Successful");
        });
    }catch(err){
        console.log(err);
    }
	console.log('Bot is online');
};