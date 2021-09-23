import { LogLevel, Logger } from "#classes/Logger";

import type { DiscordEvent } from "#types/DiscordEvent";

const event: DiscordEvent = {
	data: {
		name: "readyEvent",
		event: "ready",
		description: "boop",
		once: true
	},
	async execute() {
		const logger = new Logger(LogLevel.INFO);
		logger.info("bot is ready.");
	}
};

export default event;
