import { GuildMember } from "discord.js";

import type { SlashCommand } from "#types/Commands";

const command: SlashCommand = {
	data: {
		name: "kick",
		description: "Kick someone",
		options: [
			{
				name: "user",
				description: "User to kick",
				type: "USER",
				required: true
			},
			{
				name: "reason",
				description: "Moderation reason",
				type: "STRING"
			}
		]
	},
	permissions: [],
	async execute(interaction) {
		if (!interaction.guild) return;
		const { me } = interaction.guild;

		if (!me?.permissions.has("KICK_MEMBERS")) return interaction.reply("I dont have the KICK_MEMBERS permission");

		const user = interaction.options.getUser("user", true);
		const reason = interaction.options.getString("reason") ?? "no reason";

		const member = await interaction.guild.members.fetch(user);
		if (!(member instanceof GuildMember)) return;

		if (member.roles.highest.position > me.roles.highest.position || member.permissions.has("ADMINISTRATOR"))
			return interaction.reply({ content: "I do not have the permissions to kick this person" });

		member
			.kick(reason)
			.then(() => {
				interaction.reply(`**${user.tag}** has been kicked`);
			})
			.catch((e) => {
				interaction.client.logger.error(e);
			});
	}
};

export default command;
