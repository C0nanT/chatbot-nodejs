const { StateManager } = require("../managers/state-manager");

jest.mock("../managers/log-manager.js", () => {
	return {
		LogManager: jest.fn().mockImplementation(() => {
			return {
				logAccess: jest.fn(),
			};
		}),
	};
});

describe("StateManager", () => {
	let stateManager;

	beforeEach(() => {
		stateManager = new StateManager();
	});

	describe("getCurrentState", () => {
		it("deve retornar null quando nenhum estado foi definido", () => {
			expect(stateManager.getCurrentState()).toBe(null);
		});

		it("deve retornar o estado atual após transição", () => {
			stateManager.transition("estadoTeste");
			expect(stateManager.getCurrentState()).toBe("estadoTeste");
		});
	});

	describe("registerHandler", () => {
		it("deve registrar um manipulador para um estado específico", () => {
			const handler = jest.fn();
			stateManager.registerHandler("estadoTeste", handler);
			expect(stateManager.getHandler("estadoTeste")).toBe(handler);
		});

		it("deve registrar manipuladores para estados diferentes", () => {
			const handler1 = jest.fn();
			const handler2 = jest.fn();
			stateManager.registerHandler("estado1", handler1);
			stateManager.registerHandler("estado2", handler2);
			expect(stateManager.getHandler("estado1")).toBe(handler1);
			expect(stateManager.getHandler("estado2")).toBe(handler2);
		});
	});

	describe("getHandler", () => {
		it("deve retornar o manipulador registrado para um estado específico", () => {
			const handler = jest.fn();
			stateManager.registerHandler("estadoTeste", handler);
			expect(stateManager.getHandler("estadoTeste")).toBe(handler);
		});

		it("deve retornar undefined se nenhum manipulador estiver registrado para o estado", () => {
			expect(stateManager.getHandler("estadoInexistente")).toBe(
				undefined
			);
		});
	});

	describe("transition", () => {
		it("deve transitar para um novo estado", () => {
			stateManager.transition("estado1");
			expect(stateManager.getCurrentState()).toBe("estado1");
		});

		it("deve retornar o novo estado após a transição", () => {
			const resultado = stateManager.transition("novoEstado");
			expect(resultado).toBe("novoEstado");
		});

		it("deve registrar a transição no histórico quando já existe um estado atual", () => {
			stateManager.transition("estadoInicial");
			stateManager.transition("estadoFinal");

			// Verificar se o histórico foi atualizado corretamente
			expect(stateManager.transitionHistory).toHaveLength(1);
			expect(stateManager.transitionHistory[0].from).toBe(
				"estadoInicial"
			);
			expect(stateManager.transitionHistory[0].to).toBe("estadoFinal");
			expect(stateManager.transitionHistory[0].timestamp).toBeInstanceOf(
				Date
			);
		});

		it("não deve registrar na transição no histórico para a primeira transição", () => {
			stateManager.transition("estadoInicial");
			expect(stateManager.transitionHistory).toHaveLength(0);
		});
	});
});
