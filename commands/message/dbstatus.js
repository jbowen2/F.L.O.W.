const { Message, MessageEmbed} = require('discord.js');
const { mysqlserver } = require('../../configs/config.json');
module.exports = {
	name: 'dbstatus',
	description: 'provids info about the DB',
	args: false,
    /**
     * 
     * @param { Message } message 
     */
	execute(message) {
        const embed = new MessageEmbed()
            .setTitle("DB conection Info")
            .addFields(
                {name: 'Host', value: `${mysqlserver.host}`, inline: true},
                {name: 'User', value: `${mysqlserver.user}`, inline: true},
                {name: 'Database', value: `${mysqlserver.database}`, inline: true},
                {name: 'Type', value: `mySQL`, inline: true},
            );
        message.reply(embed);
    },
};