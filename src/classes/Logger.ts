import chalk from "chalk";

import type { Chalk } from "chalk";

export enum LogLevel {
	ALL,
	DEBUG,
	INFO,
	WARN,
	ERROR,
	FATAL,
	NONE
}

export class Logger {
	public logLevel;

	public constructor(level: LogLevel = LogLevel.NONE) {
		this.logLevel = level;
	}

	private log(input: any, time: boolean, modifier: string, colorFn: Chalk) {
		let timeString;
		if (time) {
			timeString = `: ${new Date().toLocaleTimeString()}`;
		} else {
			timeString = "";
		}
		console.log(colorFn(`[ ${modifier}${timeString} ] `), input);
	}

	public debug(input: any, time = true) {
		if (this.logLevel > LogLevel.DEBUG) return;
		this.log(input, time, "DEBUG", chalk.yellow);
	}

	public info(input: any, time = true) {
		if (this.logLevel > LogLevel.INFO) return;
		this.log(input, time, "INFO ", chalk.green);
	}

	public warn(input: any, time = true) {
		if (this.logLevel > LogLevel.WARN) return;
		this.log(input, time, "WARN ", chalk.hex("#FC7F03"));
	}

	public error(input: any, time = true) {
		if (this.logLevel > LogLevel.ERROR) return;
		this.log(input, time, "ERROR", chalk.red);
	}

	public fatal(input: any, time = true) {
		if (this.logLevel > LogLevel.FATAL) return;
		this.log(input, time, "FATAL", chalk.bgRedBright.black);
	}
}
