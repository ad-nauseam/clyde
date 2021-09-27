import { GuildChannel } from "discord.js";
import { staffId } from "#constants/ids";

import type { SlashCommand } from "#types/Commands";

const command: SlashCommand = {
	data: {
		name: "purge",
		description: "remove upto 100 messages from chat",
		defaultPermission: false,
		options: [
			{
				name: "count",
				type: "NUMBER",
				description: "how many messages do you want to clear? (1 - 100)",
				required: true
			}
		]
	},
	permissions: [
		{
			type: "ROLE",
			id: staffId,
			permission: true
		}
	],
	async execute(interaction) {
		const count = interaction.options.getNumber("count", true);
		if (count > 100 || count < 1) {
			interaction.reply({ content: "I can only clear between 1 and 100 messages!", ephemeral: true });
		} else {
			const { channel } = interaction;
			if (!channel) return;
			if (channel instanceof GuildChannel) {
				const data = await channel.bulkDelete(count);
				interaction.reply({ content: `Deleted ${data.size} messages!`, ephemeral: true });
			} else {
				interaction.reply({ content: "This command cannot be used here", ephemeral: true });
			}
		}
	}
};

export default command;
