import { Team } from "discord.js";
import { Type } from "@sapphire/type";
import { inspect } from "util";

import type { CommandInteraction } from "discord.js";
import type { SlashCommand } from "#types/Commands";

function format(..._: [string, string][]) {
	return _.map(([k, v]) => `__**${k}:**__\n\`\`\`ts\n${v}\n\`\`\``).join("\n");
}

async function _eval(interaction: CommandInteraction) {
	const code = interaction.options.getString("code")!;
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
			: { content: format(["Output", evaled], ["Input", code], ["Type", type.toString()]) }
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

		if (owner instanceof Team) {
			if (owner.members.has(interaction.user.id)) await _eval.call(this, interaction);
		} else if (owner?.id === interaction.user.id) await _eval.call(this, interaction);
	}
};

export default command;
