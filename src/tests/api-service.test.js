const axios = require("axios");
const { ApiService } = require("../services/api-service");
const { LogManager } = require("../managers/log-manager");

jest.mock("axios");

jest.mock("../managers/log-manager", () => {
	return {
		LogManager: jest.fn().mockImplementation(() => {
			return {
				logAccess: jest.fn(),
				logError: jest.fn(),
			};
		}),
	};
});

describe("ApiService", () => {
	let apiService;

	beforeEach(() => {
		jest.clearAllMocks();
		apiService = new ApiService();
	});

	describe("consultCep", () => {
		it("deve retornar dados de endereço quando o CEP é válido", async () => {
			const mockResponse = {
				data: {
					cep: "01001-000",
					logradouro: "Praça da Sé",
					bairro: "Sé",
					localidade: "São Paulo",
					uf: "SP",
				},
			};

			axios.get.mockResolvedValueOnce(mockResponse);

			const result = await apiService.consultCep("01001-000");

			expect(axios.get).toHaveBeenCalledWith(
				"https://viacep.com.br/ws/01001000/json/"
			);
			expect(result).toEqual(mockResponse.data);
			expect(apiService.logManager.logAccess).toHaveBeenCalledTimes(2);
		});

		it("deve retornar erro quando o CEP não é encontrado", async () => {
			const mockResponse = {
				data: {
					erro: true,
				},
			};

			axios.get.mockResolvedValueOnce(mockResponse);

			const result = await apiService.consultCep("00000-000");

			expect(axios.get).toHaveBeenCalledWith(
				"https://viacep.com.br/ws/00000000/json/"
			);
			expect(result).toEqual({
				error: "CEP não encontrado. Verifique o número e tente novamente.",
			});
			expect(apiService.logManager.logError).toHaveBeenCalled();
		});

		it("deve lançar um erro quando a requisição falha", async () => {
			axios.get.mockRejectedValueOnce(new Error("Network Error"));

			await expect(apiService.consultCep("01001-000")).rejects.toThrow(
				"Failed to fetch CEP data"
			);
			expect(apiService.logManager.logError).toHaveBeenCalled();
		});
	});

	describe("getCoordinates", () => {
		it("deve retornar coordenadas quando a cidade é encontrada", async () => {
			const mockResponse = {
				data: {
					results: [
						{
							name: "São Paulo",
							latitude: -23.5475,
							longitude: -46.6361,
						},
					],
				},
			};

			axios.get.mockResolvedValueOnce(mockResponse);

			const result = await apiService.getCoordinates("São Paulo");

			expect(axios.get).toHaveBeenCalledWith(
				"https://geocoding-api.open-meteo.com/v1/search",
				{
					params: {
						name: "São Paulo",
						count: 1,
						language: "pt",
						format: "json",
					},
				}
			);
			expect(result).toEqual({
				latitude: -23.5475,
				longitude: -46.6361,
			});
			expect(apiService.logManager.logAccess).toHaveBeenCalled();
		});

		it("deve retornar erro quando a cidade não é encontrada", async () => {
			const mockResponse = {
				data: {
					results: [],
				},
			};

			axios.get.mockResolvedValueOnce(mockResponse);

			const result = await apiService.getCoordinates("CidadeInexistente");

			expect(result).toEqual({
				error: "Cidade não encontrada. Verifique o nome e tente novamente. ",
			});
		});

		it("deve lançar um erro quando a requisição falha", async () => {
			axios.get.mockRejectedValueOnce(new Error("Network Error"));

			await expect(
				apiService.getCoordinates("São Paulo")
			).rejects.toThrow("Falha ao buscar coordenadas de: São Paulo");
			expect(apiService.logManager.logError).toHaveBeenCalled();
		});
	});

	describe("getWeather", () => {
		it("deve retornar dados climáticos quando as coordenadas são válidas", async () => {
			const mockResponse = {
				data: {
					current: {
						temperature_2m: 25,
						weather_code: 0,
					},
					daily: {
						temperature_2m_max: [30],
						temperature_2m_min: [20],
						weather_code: [0],
					},
				},
			};

			axios.get.mockResolvedValueOnce(mockResponse);

			const result = await apiService.getWeather(-23.5475, -46.6361);

			expect(axios.get).toHaveBeenCalledWith(
				"https://api.open-meteo.com/v1/forecast",
				{
					params: {
						latitude: -23.5475,
						longitude: -46.6361,
						current: "temperature_2m,weather_code",
						daily: "temperature_2m_max,temperature_2m_min,weather_code",
						timezone: "America/Sao_Paulo",
						forecast_days: 1,
					},
				}
			);
			expect(result).toEqual(mockResponse.data);
			expect(apiService.logManager.logAccess).toHaveBeenCalledTimes(2);
		});

		it("deve lançar um erro quando a requisição falha", async () => {
			axios.get.mockRejectedValueOnce(new Error("Network Error"));

			await expect(
				apiService.getWeather(-23.5475, -46.6361)
			).rejects.toThrow("Falha ao obter dados climáticos");
			expect(apiService.logManager.logError).toHaveBeenCalled();
		});
	});
});
