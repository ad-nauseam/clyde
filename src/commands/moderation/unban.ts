import type { SlashCommand } from "#types/Commands";
import { compareTwoStrings } from 'string-similarity'

const command: SlashCommand = {
	data: {
		name: "unban",
		description: "unban someone",
		options: [
			{
                name: 'user',
                description: 'User to kick',
                type: 'STRING',
                autocomplete: true,
                required: true
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
		const user = interaction.options.getString('user')!
        const reason = interaction.options.getString('reason') || 'no reason provided'

        const me = interaction.guild?.me
        if(!me?.permissions.has('BAN_MEMBERS')) return interaction.reply('I dont have the BAN_MEMBERS permissions')

        

        interaction.guild?.members.unban(user)

        interaction.reply(`**${user}** has been unbanned`)
	},

    async autocomplete(interaction) {
        const x = interaction.options.getFocused()
        const input = (x as string).toLowerCase()

        const bans = (await interaction.guild?.bans.fetch())?.sort((a,b) => compareTwoStrings(input, b.user.tag) - compareTwoStrings(input, a.user.tag))

        return bans?.map(y => ({ name: y.user.tag, value: y.user.id }))!
    }
};

export default command;
