import type {
	ApplicationCommandPermissionData,
	ChatInputApplicationCommandData,
	CommandInteraction,
	ContextMenuInteraction,
	MessageApplicationCommandData,
	UserApplicationCommandData,
	AutocompleteInteraction
} from "discord.js";

interface SlashCommand {
	data: ChatInputApplicationCommandData;
	permissions?: ApplicationCommandPermissionData[];
	execute(interaction: CommandInteraction): Promise<void>;
	autocomplete?(interaction: AutocompleteInteraction): Promise<{ name: string, value: any }[]>
}

type ContextMenuItem = MessageApplicationCommandData | UserApplicationCommandData;

interface ContextMenuCommand {
	data: ContextMenuItem;
	permissions?: ApplicationCommandPermissionData[];
	execute(interaction: ContextMenuInteraction): Promise<void>;
}

export { SlashCommand, ContextMenuCommand };
