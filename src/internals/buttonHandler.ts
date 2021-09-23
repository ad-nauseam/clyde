import { Collection } from "discord.js";
import { join } from "path";
import { loadFiles } from "#utils/loadFiles";

import type { ButtonHandlerObject } from "#types/ButtonHandlerObject";
import type { Client } from "discord.js";

async function startButtonHandler(client: Client): Promise<Collection<string, ButtonHandlerObject>> {
	const buttons = new Collection<string, ButtonHandlerObject>();
	await loadFiles(buttons, join(__dirname, "..", "buttons"), client);

	client.logger.info(`${buttons.size} button${buttons.size === 1 ? "" : "s"} loaded.`);

	client.on("interactionCreate", (interaction) => {
		if (!interaction.isButton()) return;
		const { customId } = interaction;
		const matches = buttons.filter((x) => customId.match(x.data.match) !== null);
		for (const [, btn] of matches) {
			btn.execute(interaction);
		}
	});
	return buttons;
}

export { startButtonHandler };
