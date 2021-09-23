import type { ButtonInteraction } from "discord.js";

export interface ButtonHandlerObject {
	data: {
		name: string;
		description: string;
		match: RegExp;
	};
	execute(button: ButtonInteraction): Promise<void>;
}
