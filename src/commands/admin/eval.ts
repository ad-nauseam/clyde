import { Type } from "@sapphire/type";
import { formatList } from "#utils/formatting";
import { inspect } from "util";

import type { CommandInteraction, Team } from "discord.js";
import type { SlashCommand } from "#types/Commands";

async function _eval(interaction: CommandInteraction) {
	const code = interaction.options.getString("code", true);
	const r = interaction.options.getBoolean("return");

	let evaled;

	try {
		/* eslint-disable-next-line no-eval */
		evaled = await eval(`( async () => {
            ${r ? "" : "return"} ${code}
        })()`);
	} catch (e) {
		evaled = e;
	}

	const type = new Type(evaled);

	if (typeof evaled != "string") evaled = inspect(evaled, { depth: 0 });

	interaction.reply(
		evaled.length > 2000
			? { files: [{ name: "output.js", attachment: Buffer.from(evaled) }] }
			: { content: formatList(["Output", evaled], ["Input", code], ["Type", type.toString()]) }
	);
}

const command: SlashCommand = {
	data: {
		name: "eval",
		description: "Evaluate code",
		options: [
			{
				name: "code",
				description: "JS code",
				type: "STRING",
				required: true
			},
			{
				name: "return",
				description: "Manual return?",
				type: "BOOLEAN"
			}
		]
	},
	permissions: [],
	async execute(interaction) {
		const owner = (await interaction.client.application?.fetch())?.owner;

		if ((owner as Team).members.has(interaction.user.id) || owner?.id === interaction.user.id)
			_eval.call(this, interaction);
	}
};

export default command;
