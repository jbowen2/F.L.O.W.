const mysql = require('mysql');
const { Client } = require('discord.js');
const { mysqlserver } = require('../../configs/config.json')
/**
 * 
 * @param { Client } client 
 */
module.exports = ( client ) => {
	const con = mysql.createConnection(mysqlserver);
	con.connect(function(err){ 
		if (err) throw err;
		console.log("Connection To DB Successful");
	});
	
	console.log('Bot is online');
};