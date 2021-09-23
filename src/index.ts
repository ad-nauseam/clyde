import { Client, Intents } from "discord.js";
import { LogLevel, Logger } from "#classes/Logger";
import { startButtonHandler } from "#internals/buttonHandler";
import { startCommandHandler } from "#internals/commandHandler";
import { startEventHandler } from "#internals/eventHandler";

declare module "discord.js" {
	interface Client {
		logger: Logger;
	}
}

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

let level = LogLevel.INFO;

if (process.argv.includes("--debug")) level = LogLevel.DEBUG;

client.logger = new Logger(level);

startEventHandler(client);
startCommandHandler(client);
startButtonHandler(client);

client
	.login()
	.then(() =>
		client.logger.info(
			client.generateInvite({ permissions: "ADMINISTRATOR", scopes: ["bot", "applications.commands"] })
		)
	);
