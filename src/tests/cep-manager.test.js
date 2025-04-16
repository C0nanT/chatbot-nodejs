const { CepManager } = require("../managers/cep-manager");

jest.mock("../managers/log-manager.js", () => {
	return {
		LogManager: jest.fn().mockImplementation(() => {
			return {
				logAccess: jest.fn(),
			};
		}),
	};
});

describe("CepManager", () => {
	let cepManager;

	beforeEach(() => {
		cepManager = new CepManager();
	});

	describe("validateCep", () => {
		it("deve retornar true para um CEP válido de 8 dígitos", () => {
			expect(cepManager.validateCep("12345678")).toBe(true);
			expect(cepManager.isValid).toBe(true);
		});

		it("deve retornar false para um CEP com menos de 8 dígitos", () => {
			expect(cepManager.validateCep("1234567")).toBe(false);
			expect(cepManager.isValid).toBe(false);
		});

		it("deve retornar false para um CEP com mais de 8 dígitos", () => {
			expect(cepManager.validateCep("123456789")).toBe(false);
			expect(cepManager.isValid).toBe(false);
		});

		it("deve retornar false para um CEP com caracteres não numéricos", () => {
			expect(cepManager.validateCep("1234567a")).toBe(false);
			expect(cepManager.isValid).toBe(false);
		});
	});

	describe("setCep", () => {
		it("deve definir o CEP removendo caracteres não numéricos", () => {
			cepManager.setCep("12.345-678");
			expect(cepManager.getCep()).toBe("12345678");
		});
	});

	describe("getCep", () => {
		it("deve retornar o CEP definido", () => {
			cepManager.setCep("12345678");
			expect(cepManager.getCep()).toBe("12345678");
		});

		it("deve retornar string vazia quando nenhum CEP foi definido", () => {
			expect(cepManager.getCep()).toBe("");
		});
	});
});
