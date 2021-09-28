import { Collection } from "discord.js";
import { MAIN_GUILD_ID } from "#constants/guilds";
import { join } from "path";
import { loadFiles } from "#utils/loadFiles";

import type {
	ApplicationCommand,
	ApplicationCommandData,
	Client,
	GuildApplicationCommandPermissionData,
	Snowflake
} from "discord.js";
import type { ContextMenuCommand, SlashCommand } from "#types/Commands";

const plural = (x: number) => (x === 1 ? "" : "s");

function startCommandHandler(client: Client) {
	const slashCommands = new Collection<string, SlashCommand>();
	const contextCommands = new Collection<string, ContextMenuCommand>();
	let commandData: Collection<Snowflake, ApplicationCommand>;

	async function setCommands(
		slashCommands: Collection<string, SlashCommand>,
		contextCommands: Collection<string, ContextMenuCommand>
	): Promise<Collection<Snowflake, ApplicationCommand>> {
		const slashCmdArr: ApplicationCommandData[] = slashCommands.map((x) => x.data);
		const contextCmdArr: ApplicationCommandData[] = contextCommands.map((x) => x.data);
		const cmdArr = [...slashCmdArr, ...contextCmdArr];
		const guild = client.guilds.cache.get(MAIN_GUILD_ID);

		if (!guild) {
			client.logger.error("Guild could not be detected.");
			return new Collection();
		}
		if (process.argv.includes("--type-change")) {
			guild.commands.set([]);
			client.logger.info(`Commands cleared in ${guild.name}`);
		}

		const setInfo = await guild.commands.set(cmdArr);
		if (!setInfo.size) {
			client.logger.error("Failed to set slash commands.");
			return setInfo;
		}
		const slashCount = setInfo.reduce((x, y) => {
			return x + (y.type === "CHAT_INPUT" ? 1 : 0);
		}, 0);
		const contextCount = setInfo.size - slashCount;
		client.logger.info(`${slashCount} slash command${plural(slashCount)} set successfully in ${guild.name}.`);
		client.logger.info(`${contextCount} context menu item${plural(contextCount)} set successfully in ${guild.name}.`);
		return setInfo;
	}

	async function setPermissions(
		slashCommands: Collection<string, SlashCommand>,
		contextCommands: Collection<string, ContextMenuCommand>,
		commandData: Collection<Snowflake, ApplicationCommand>
	): Promise<void> {
		const permissions: GuildApplicationCommandPermissionData[] = [];
		const cmd = commandData.first();
		if (!cmd) return;
		const guild = cmd.guild;
		if (!guild) {
			client.logger.error("Could not get the guild for setting permissions.");
			return;
		}
		for (const [key, val] of commandData) {
			const command = slashCommands.get(val.name) ?? contextCommands.get(val.name);
			if (!command || !command.permissions) continue;
			const data: GuildApplicationCommandPermissionData = {
				id: key,
				permissions: command.permissions
			};
			permissions.push(data);
		}
		const permSetInfo = await guild.commands.permissions.set({ fullPermissions: permissions });
		if (permSetInfo.size === 0) {
			client.logger.info("No permissions have been set.");
			return;
		}
		client.logger.info("Permissions set successfully.");
	}

	client.once("ready", async () => {
		// Loading commands from /commands.
		await loadFiles(slashCommands, join(__dirname, "..", "commands"), client);
		await loadFiles(contextCommands, join(__dirname, "..", "context-commands"), client);

		client.logger.info(`${slashCommands.size} slash command${plural(slashCommands.size)} loaded.`);
		client.logger.info(`${contextCommands.size} context menu item${plural(contextCommands.size)} loaded.`);

		if (process.argv.includes("--edit")) {
			// Setting the commands as slash commands in the selected guild.
			commandData = await setCommands(slashCommands, contextCommands);

			// Configuring permissions for every command.
			await setPermissions(slashCommands, contextCommands, commandData);
		} else {
			client.logger.info("No commands set.");
		}
	});
	client.on("interactionCreate", async (interaction) => {
		if (interaction.isCommand()) {
			const cmd = slashCommands.get(interaction.commandName);
			if (!cmd) {
				return;
			}
			client.logger.debug(`/${cmd.data.name} executed by ${interaction.user.tag}.`);
			cmd.execute(interaction);
		} else if (interaction.isContextMenu()) {
			const cmd = contextCommands.get(interaction.commandName);
			if (!cmd) {
				return;
			}
			client.logger.debug(`(ctx) ${cmd.data.name} executed by ${interaction.user.tag}.`);
			cmd.execute(interaction);
		} else if (interaction.isAutocomplete()) {
			const cmd = slashCommands.get(interaction.commandName)
			if(!cmd || !cmd.autocomplete) return
			const res = await cmd.autocomplete(interaction)

			const choices = res.slice(0, 25).map(({ name, value }) => ({
				name: name.substr(0, 99),
				value: typeof value == 'string' ? value.substr(0, 99) : value
			}))

			interaction.respond(choices)
		}
	});

	return [slashCommands, contextCommands];
}

export { startCommandHandler };
