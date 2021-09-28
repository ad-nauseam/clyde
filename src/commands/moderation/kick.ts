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
		const user = interaction.options.getUser("user")!;
		const reason = interaction.options.getString("reason") ?? "no reason";

		if (!interaction.guild) return;

		const member = await interaction.guild.members.fetch(user);
		const me = interaction.guild.me;

		if (!me?.permissions.has("KICK_MEMBERS")) return interaction.reply("I dont have the KICK_MEMBERS permission");
		if (member.roles.highest.position > me.roles.highest.position || member.permissions.has("ADMINISTRATOR"))
			return interaction.reply({ content: "I do not have the permissions to kick this person" });

		member.kick(reason);

		interaction.reply(`**${user.tag}** has been kicked`);
	}
};

export default command;
