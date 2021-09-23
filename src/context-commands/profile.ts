import type { ContextMenuCommand } from "#types/Commands";
import { MessageEmbed } from "discord.js";

const command: ContextMenuCommand = {
	data: {
		name: "profile",
		type: "USER"
	},
	async execute(interaction) {
		const member = await interaction.guild?.members.fetch(interaction.targetId);
		if (!member) {
			interaction
				.reply({
					content: "Invalid member\nmake sure this person is in the guild currently",
					ephemeral: true
				})
				.catch(interaction.client.logger.warn);
			return;
		}
		const { displayName, user, id, displayColor } = member;
		const { tag } = user;
		const embed = new MessageEmbed()
			.setTitle(`${displayName}'s profile`)
			.setColor(displayColor)
			.addFields([
				{
					name: "username",
					value: tag,
					inline: false
				},
				{
					name: "id",
					value: id,
					inline: true
				}
			]);
		interaction.reply({ embeds: [embed] }).catch(interaction.client.logger.warn);
	}
};

export default command;
