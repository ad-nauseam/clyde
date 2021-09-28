import { GuildMember } from "discord.js";
import type { SlashCommand } from "#types/Commands";

const command: SlashCommand = {
	data: {
		name: "ban",
		description: "ban someone",
		options: [
			{
				name: "user",
				description: "User to ban",
				type: "USER",
				required: true
			},
			{
				name: "days",
				description: "# of days of messages to delete",
				type: "NUMBER",
				choices: Array(8)
					.fill(0)
					.map((_, k) => ({ name: k ? `${k} Day${k === 1 ? "" : "s"}` : "None", value: k }))
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

		if (!me?.permissions.has("BAN_MEMBERS"))
			return interaction.reply({ content: "I do not have the BAN_MEMBERS permissions", ephemeral: true });

		const user = interaction.options.getUser("user", true);
		const reason = interaction.options.getString("reason") ?? "no reason provided";
		const days = interaction.options.getNumber("days") ?? 0;

		const member = await interaction.guild.members.fetch(user);

		if (member instanceof GuildMember) {
			if (member.roles.highest.position > me.roles.highest.position)
				return interaction.reply({ content: "I do not have the permission to ban this user", ephemeral: true });
			if (member.id === me.id) return interaction.reply({ content: "I wont ban myself", ephemeral: true });
		}

		await interaction.guild.members
			.ban(user, { reason, days })
			.then((x) => {
				interaction.reply(`**${x.toString()}** has been banned`);
			})
			.catch((e: Error) => {
				interaction.client.logger.error(e);
			});
	}
};

export default command;
