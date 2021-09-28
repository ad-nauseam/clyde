import type { ContextMenuCommand } from "#types/Commands";

import { MessageEmbed } from "discord.js";
import { formatFieldList } from "#utils/formatting";

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
		const { user, displayColor } = member;
		const { username, tag, discriminator } = user;
		const embed = new MessageEmbed({
			author: {
				name: tag,
				icon_url: user.displayAvatarURL()
			},
			fields: formatFieldList([
				"User Details",
				[
					["Username", username],
					["Discriminator", discriminator]
				]
			]),
			color: displayColor
		});

		interaction.reply({ embeds: [embed] }).catch(interaction.client.logger.warn);
	}
};

export default command;
