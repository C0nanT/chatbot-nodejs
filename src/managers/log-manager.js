const fs = require("fs");

class LogManager {
	constructor() {
		this.ensureLogFilesExist();
	}

	/**
	 * @description Verifica se os arquivos de log existem e os cria se não existirem
	 * @returns {void}
	 */
	ensureLogFilesExist() {
		const logPaths = ["logs/access.log", "logs/errors.log"];

		logPaths.forEach((path) => {
			const dir = path.substring(0, path.lastIndexOf("/"));
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			if (!fs.existsSync(path)) {
				fs.writeFileSync(path, "");
			}
		});
	}

	/**
	 * @description Registra uma mensagem de acesso no arquivo de log
	 * @param {string} message - Mensagem a ser registrada
	 * @return {void}
	 * */
	logAccess(message) {
		const logEntry = `[${new Date().toISOString()}] - ${message}\n`;
		fs.appendFileSync("logs/access.log", logEntry);
	}

	/**
	 * @description Registra uma mensagem de erro no arquivo de log
	 * @param {string} errorMessage - Mensagem de erro a ser registrada
	 * @return {void}
	 * */
	logError(errorMessage) {
		const logEntry = `[${new Date().toISOString()}] - ${errorMessage}\n`;
		fs.appendFileSync("logs/errors.log", logEntry);
	}
}
module.exports = { LogManager };
