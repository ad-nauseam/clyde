export function formatList(...args: [string, string][]) {
	return args.map(([k, v]) => `__**${k}:**__\n\`\`\`ts\n${v}\n\`\`\``).join("\n");
}

export function formatFieldList(...args: [[string, [string, string][]]]): { name: string; value: string }[] {
	return args.map(([k, v]) => ({ name: `__${k}__`, value: `${v.map(([k, v]) => `**${k}:** ${v}`).join("\n")}` }));
}
