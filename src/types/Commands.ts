import type {
	ApplicationCommandPermissionData,
	ChatInputApplicationCommandData,
	CommandInteraction,
	ContextMenuInteraction,
	MessageApplicationCommandData,
	UserApplicationCommandData
} from "discord.js";

interface SlashCommand {
	data: ChatInputApplicationCommandData;
	permissions?: ApplicationCommandPermissionData[];
	execute(interaction: CommandInteraction): Promise<void>;
}

type ContextMenuItem = MessageApplicationCommandData | UserApplicationCommandData;

interface ContextMenuCommand {
	data: ContextMenuItem;
	permissions?: ApplicationCommandPermissionData[];
	execute(interaction: ContextMenuInteraction): Promise<void>;
}

export { SlashCommand, ContextMenuCommand };
