import type { SlashCommand } from "#types/Commands";

const command: SlashCommand = {
	data: {
		name: "ban",
		description: "ban someone",
		options: [
			{
                name: 'user',
                description: 'User to kick',
                type: 'USER',
                required: true
            },
            {
                name: 'days',
                description: '# of days of messages to delete',
                type: 'NUMBER',
                choices: Array(8).fill(0).map((_,k) => ({ name: k ? k+` Day${k == 1 ? '' : 's'}` : 'None', value: k }))
            },
            {
                name: 'reason',
                description: 'Moderation reason',
                type: 'STRING'
            }
		]
	},
	permissions: [],
	async execute(interaction) {
		const user = interaction.options.getUser('user')!
        const reason = interaction.options.getString('reason') || 'no reason provided'
        const days = interaction.options.getNumber('days') || 0

        const member = await interaction.guild?.members.fetch(user)
        const me = interaction.guild?.me

        if(!me?.permissions.has('BAN_MEMBERS')) return interaction.reply('I dont have the BAN_MEMBERS permissions')
        if(member?.permissions.has('ADMINISTRATOR') && !user.bot) return interaction.reply({ content: `I do not have the permissions to ban this person` })

        member?.ban({ reason, days })

        interaction.reply(`**${user.tag}** has been banned`)
	}
};

export default command;
