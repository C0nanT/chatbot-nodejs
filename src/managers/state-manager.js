const { LogManager } = require("./log-manager.js");

class StateManager {
	constructor() {
		this.currentState = null;
		this.handlers = new Map();
		this.transitionHistory = [];
		this.logManager = new LogManager();
	}

	/**
	 * @description Resgata o estado atual
	 * @return {string|null} - O estado atual ou null se não houver
	 */
	getCurrentState() {
		return this.currentState;
	}

	/**
	 * @description Registra um manipulador para um estado específico
	 * @param {string} state - O estado para o qual o manipulador será registrado
	 * @param {function} handlerFunction - A função manipuladora a ser registrada
	 * @return {void}
	 */
	registerHandler(state, handlerFunction) {
		this.handlers.set(state, handlerFunction);

		this.logManager.logAccess(`Handler registered: ${state}`);
	}

	/**
	 * @description Obtém o manipulador registrado para um estado específico
	 * @param {string} state - O estado para o qual o manipulador será obtido
	 * @return {function|null} - A função manipuladora registrada ou null se não houver
	 */
	getHandler(state) {
		return this.handlers.get(state);
	}

	/**
	 * @description Transita para um novo estado
	 * @param {string} newState - O novo estado para o qual transitar
	 * @return {string} - O estado atual após a transição
	 */
	transition(newState) {
		if (this.currentState) {
			this.transitionHistory.push({
				from: this.currentState,
				to: newState,
				timestamp: new Date(),
			});

			this.logManager.logAccess(
				`Transitioning from ${this.currentState} to ${newState}`
			);
		}

		this.currentState = newState;
		return this.currentState;
	}
}

module.exports = { StateManager };
