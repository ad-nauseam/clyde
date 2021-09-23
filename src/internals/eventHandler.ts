import { Collection } from "discord.js";
import { join } from "path";
import { loadFiles } from "#utils/loadFiles";

import type { Client, ClientEvents } from "discord.js";
import type { DiscordEvent } from "#types/DiscordEvent";

async function startEventHandler(client: Client): Promise<Collection<string, DiscordEvent>> {
	const events = new Collection<string, DiscordEvent>();
	await loadFiles(events, join(__dirname, "..", "events"), client);

	client.logger.info(`${events.size} event${events.size === 1 ? "" : "s"} loaded.`);

	const onEvents = new Collection<keyof ClientEvents, DiscordEvent[]>();
	const onceEvents = new Collection<keyof ClientEvents, DiscordEvent[]>();

	for (const [, eventFile] of events) {
		const { data } = eventFile;
		if (data.once) {
			const vals = onceEvents.get(data.event);
			if (!vals) {
				onceEvents.set(data.event, [eventFile]);
			} else {
				vals.push(eventFile);
			}
		} else {
			const vals = onEvents.get(data.event);
			if (!vals) {
				onEvents.set(data.event, [eventFile]);
			} else {
				vals.push(eventFile);
			}
		}
	}

	for (const [event, val] of onEvents) {
		client.on(event, (...params) => {
			for (const dEvent of val) {
				// @ts-expect-error Types being weird
				dEvent.execute(...params);
			}
		});
		client.logger.debug(`${event} event set successfully.`);
	}

	for (const [event, val] of onceEvents) {
		client.once(event, (...params) => {
			for (const dEvent of val) {
				// @ts-expect-error Types being weird 2: Electric boogaloo
				dEvent.execute(...params);
			}
		});
		client.logger.debug(`${event} event set successfully.`);
	}

	return events;
}

export { startEventHandler };
