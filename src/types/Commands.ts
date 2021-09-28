import type {
	ApplicationCommandPermissionData,
	AutocompleteInteraction,
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
	autocomplete?(interaction: AutocompleteInteraction): Promise<{ name: string; value: any }[] | undefined>;
}

type ContextMenuItem = MessageApplicationCommandData | UserApplicationCommandData;

interface ContextMenuCommand {
	data: ContextMenuItem;
	permissions?: ApplicationCommandPermissionData[];
	execute(interaction: ContextMenuInteraction): Promise<void>;
}

export { SlashCommand, ContextMenuCommand };
