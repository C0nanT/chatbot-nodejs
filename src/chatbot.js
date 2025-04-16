const readline = require("readline");
const chalk = require("chalk");

const { StateManager } = require("./managers/state-manager");

class Chatbot {
	constructor() {
		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		this.stateManager = new StateManager();
		this.setupStateHandlers();
	}

	/**
	 * @description Inicializa o Chatbot e configura o primeiro estado, saudação
	 * @return {void}
	 * */
	start() {
		console.clear();
		console.log(chalk.blue.bold("=================================="));
		console.log(chalk.blue.bold("             CHATBOT"));
		console.log(chalk.blue.bold("=================================="));

		this.stateManager.transition("GREETING");
		this.processCurrentState();
	}

	/**
	 * @description Registra os estados e seus respectivos manipuladores
	 * @return {void}
	 * */
	setupStateHandlers() {
		this.stateManager.registerHandler(
			"GREETING",
			this.handleGreeting.bind(this)
		);
		this.stateManager.registerHandler(
			"MAIN_MENU",
			this.handleMainMenu.bind(this)
		);
		this.stateManager.registerHandler(
			"CEP_QUERY",
			this.handleCepQuery.bind(this)
		);
		this.stateManager.registerHandler(
			"WEATHER_QUERY",
			this.handleWeatherQuery.bind(this)
		);
		this.stateManager.registerHandler("EXIT", this.handleExit.bind(this));
	}

	/**
	 * @description Processa o estado atual do Chatbot, caso não haja um manipulador registrado, encerra o Chatbot
	 * @return {void}
	 * */
	processCurrentState() {
		const currentState = this.stateManager.getCurrentState();
		const handler = this.stateManager.getHandler(currentState);

		if (handler) {
			handler();
		} else {
			console.log(chalk.red("Erro: Estado não encontrado!"));
			this.close();
		}
	}

	/**
	 * @description Manipulador para o estado de saudação
	 * @return {void}
	 * */
	handleGreeting() {}

	/**
	 * @description Manipulador para o estado do menu principal
	 * @return {void}
	 * */
	handleMainMenu() {}

	/**
	 * @description Manipulador para o estado de consulta de CEP
	 * @return {void}
	 * */
	handleCepQuery() {}

	/**
	 * @description Manipulador para o estado de consulta de clima
	 * @return {void}
	 * */
	handleWeatherQuery() {}

	/**
	 * @description Manipulador para o estado de saída
	 * @return {void}
	 * */
	handleExit() {
		console.log(chalk.green("\nObrigado por usar o Chatbot! Até logo!"));
		this.close();
	}

	close() {
		this.rl.close();
		process.exit(0);
	}
}

module.exports = { Chatbot };
