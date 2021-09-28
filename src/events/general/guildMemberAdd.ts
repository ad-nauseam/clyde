import { createCanvas, loadImage, registerFont } from "canvas";
import { sep } from "path";
import { welcomeChannelId } from "#constants/ids";

import type { GuildMember, TextChannel } from "discord.js";
import type { DiscordEvent } from "#types/DiscordEvent";

const event: DiscordEvent = {
	data: {
		name: "guildMemberAdd",
		event: "guildMemberAdd",
		description: "boop"
	},
	async execute(member: GuildMember) {
		const channel = member.guild.channels.cache.get(welcomeChannelId) as TextChannel;

		// Loading font and images
		registerFont(`${process.cwd()}${sep}fonts${sep}hack.ttf`, { family: "Hacked" });
		const back = await loadImage(`${process.cwd()}${sep}images${sep}helix.png`);
		const avatar = await loadImage(member.user.displayAvatarURL({ format: "png", size: 1024 }));

		// Creating Canvas and context
		const canvas = createCanvas(800, 200);
		const ctx = canvas.getContext("2d");

		// Black Background with double helix
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(back, 150, -50);

		// Welcome text
		ctx.font = "80px Hacked";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Welcome", canvas.width - 200, canvas.height / 2 + 30);

		// Avatar circle
		ctx.beginPath();
		ctx.arc(150, canvas.height / 2, 75, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatar, 150 - 75, canvas.height / 2 - 75, 150, 150);

		channel.send({
			content: `${member.toString()}, welcome to Helix!`,
			files: [{ name: "welcome.png", attachment: canvas.toBuffer() }]
		});
	}
};

export default event;
