// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require('discord.js');
/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 * @returns
 */
async function asyncInteraction(client, interaction) {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}
/**
 * @description Emitted whenever a message is created
 * @author John W. Bowen
 * @param { Client } client
 * @param { Interaction } interaction
 */
module.exports = (client, interaction) => {
	asyncInteraction(client, interaction);
};
