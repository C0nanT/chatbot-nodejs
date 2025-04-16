const readline = require("readline");
const chalk = require("chalk");

class Chatbot {
	constructor() {
		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
	}

	start() {
		console.clear();
		console.log(chalk.blue.bold("=================================="));
		console.log(chalk.blue.bold("             CHATBOT"));
		console.log(chalk.blue.bold("=================================="));
	}
}

module.exports = { Chatbot };
