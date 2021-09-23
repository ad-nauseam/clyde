import type { ButtonHandlerObject } from "#types/ButtonHandlerObject";

const button: ButtonHandlerObject = {
	data: {
		name: "delete",
		description: "delete the corresponding response",
		match: /deleteButton/g
	},
	async execute(button) {
		const { message } = button;
		if ("delete" in message) {
			message.delete();
		}
	}
};

export default button;
