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
	 * @description Inicializa o Chatbot e configura o primeiro estado, saudação
	 * @return {void}
	 * */
	start() {
		console.clear();
		console.log(
			chalk.bgBlueBright.bold("             CHATBOT             ")
		);

		this.stateManager.transition("GREETING");
		this.processCurrentState();
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
	 * @description Faz uma pergunta ao usuário
	 * @param {string} question - A pergunta a ser feita
	 * @return {Promise<string>} - A resposta do usuário
	 * */
	ask(question) {
		return new Promise((resolve) => {
			this.rl.question(question, (answer) => {
				resolve(answer);
			});
		});
	}

	/**
	 * @description Exibe uma animação de carregamento no console
	 * @param {string} message - A mensagem a ser exibida
	 * @param {number} duration - A duração da animação em milissegundos
	 * @return {Promise<void>} - Uma promise que é resolvida após a animação
	 * */
	showLoadingAnimation(message, duration = 2000) {
		return new Promise((resolve) => {
			const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
			let i = 0;
			process.stdout.write("\n");

			const interval = setInterval(() => {
				process.stdout.write(
					`\r${chalk.cyan(frames[i++ % frames.length])} ${chalk.cyan(
						message
					)}`
				);
			}, 100);

			setTimeout(() => {
				clearInterval(interval);
				process.stdout.write(
					"\r" + " ".repeat(message.length + 10) + "\r"
				);
				resolve();
			}, duration);
		});
	}

	/**
	 * @description Manipulador para o estado de Saudação
	 * @return {void}
	 * */
	async handleGreeting() {
		console.log(chalk.green("\nOlá! Bem-vindo ao Chatbot!"));
		console.log(
			"Estou aqui para ajudar com consultas de " +
				chalk.yellow.underline("CEP") +
				" e " +
				chalk.yellow.underline("Clima") +
				".\n"
		);

		await this.ask(
			chalk.yellow("Pressione a tecla ENTER para continuar...")
		);
		this.stateManager.transition("MAIN_MENU");
		this.processCurrentState();
	}

	/**
	 * @description Manipulador para o estado do Menu Principal
	 * @return {void}
	 * */
	async handleMainMenu() {
		console.clear();
		console.log(
			chalk.bgBlueBright.bold(
				"             MENU PRINCIPAL             \n"
			)
		);
		console.log("[1] Consultar CEP");
		console.log("[2] Consultar previsão do tempo");
		console.log("[9] Sair\n");

		const option = await this.ask(
			chalk.yellow("Escolha uma opção numérica: ")
		);

		switch (option.trim()) {
			case "1":
				this.stateManager.transition("CEP_QUERY");
				break;
			case "2":
				this.stateManager.transition("WEATHER_QUERY");
				break;
			case "9":
				this.stateManager.transition("EXIT");
				break;
			default:
				console.log(
					chalk.bgRedBright("\n  Opção inválida!  ") +
						" Tente novamente!"
				);
				await this.ask(
					chalk.yellow("\nPressione ENTER para continuar...")
				);
		}

		this.processCurrentState();
	}

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
