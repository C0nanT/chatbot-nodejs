const { WeatherManager } = require("../managers/weather-manager");
const { ApiService } = require("../services/api-service");

jest.mock("../managers/log-manager.js", () => {
	return {
		LogManager: jest.fn().mockImplementation(() => {
			return {
				logAccess: jest.fn(),
				logError: jest.fn(),
			};
		}),
	};
});

jest.mock("../services/api-service.js");

describe("WeatherManager", () => {
	let weatherManager;
	let mockApiService;

	beforeEach(() => {
		jest.clearAllMocks();

		mockApiService = {
			getCoordinates: jest.fn(),
			getWeather: jest.fn(),
		};

		ApiService.mockImplementation(() => mockApiService);

		weatherManager = new WeatherManager();
	});

	describe("setCity", () => {
		it("deve definir a cidade corretamente", () => {
			const city = "São Paulo";
			weatherManager.setCity(city);
			expect(weatherManager.getCity()).toBe(city);
		});
	});

	describe("getCity", () => {
		it("deve retornar a cidade definida", () => {
			const city = "Rio de Janeiro";
			weatherManager.setCity(city);
			expect(weatherManager.getCity()).toBe(city);
		});

		it("deve retornar string vazia quando nenhuma cidade foi definida", () => {
			expect(weatherManager.getCity()).toBe("");
		});
	});

	describe("getWeatherData", () => {
		it("deve retornar dados meteorológicos corretos quando a API responde com sucesso", async () => {
			const city = "Curitiba";
			const mockCoordinates = { latitude: -25.4284, longitude: -49.2733 };
			const mockWeatherData = {
				current: {
					temperature_2m: 22.5,
					weather_code: 0,
				},
				daily: {
					temperature_2m_max: [28.3],
					temperature_2m_min: [16.7],
				},
				timezone_offset_seconds: -10800,
			};

			mockApiService.getCoordinates.mockResolvedValue(mockCoordinates);
			mockApiService.getWeather.mockResolvedValue(mockWeatherData);

			weatherManager.setCity(city);
			const result = await weatherManager.getWeatherData();

			expect(mockApiService.getCoordinates).toHaveBeenCalledWith(city);
			expect(mockApiService.getWeather).toHaveBeenCalledWith(
				mockCoordinates.latitude,
				mockCoordinates.longitude
			);

			expect(result).toEqual(
				expect.objectContaining({
					city,
					latitude: mockCoordinates.latitude,
					longitude: mockCoordinates.longitude,
					current_temperature: mockWeatherData.current.temperature_2m,
					max_temperature:
						mockWeatherData.daily.temperature_2m_max[0],
					min_temperature:
						mockWeatherData.daily.temperature_2m_min[0],
				})
			);
		});

		it("deve retornar erro quando a cidade não for encontrada", async () => {
			const city = "CidadeInexistente";
			const errorResponse = {
				error: "Cidade não encontrada. Verifique o nome e tente novamente. ",
			};

			mockApiService.getCoordinates.mockResolvedValue(errorResponse);

			weatherManager.setCity(city);
			const result = await weatherManager.getWeatherData();

			expect(mockApiService.getCoordinates).toHaveBeenCalledWith(city);
			expect(mockApiService.getWeather).not.toHaveBeenCalled();
			expect(result).toEqual(errorResponse);
		});

		it("deve retornar erro quando a API de clima falhar", async () => {
			const city = "Belo Horizonte";
			const mockCoordinates = { latitude: -19.9208, longitude: -43.9378 };
			const errorResponse = { error: "Falha ao obter dados climáticos" };

			mockApiService.getCoordinates.mockResolvedValue(mockCoordinates);
			mockApiService.getWeather.mockResolvedValue(errorResponse);

			weatherManager.setCity(city);
			const result = await weatherManager.getWeatherData();

			expect(mockApiService.getCoordinates).toHaveBeenCalledWith(city);
			expect(mockApiService.getWeather).toHaveBeenCalledWith(
				mockCoordinates.latitude,
				mockCoordinates.longitude
			);
			expect(result).toEqual(errorResponse);
		});

		it("deve lançar um erro quando ocorrer uma exceção", async () => {
			const city = "Manaus";
			const errorMessage = "Erro de conexão";

			mockApiService.getCoordinates.mockRejectedValue(
				new Error(errorMessage)
			);

			weatherManager.setCity(city);

			await expect(weatherManager.getWeatherData()).rejects.toThrow();
		});
	});

	describe("getWeatherCondition", () => {
		it("deve retornar a condição climática correta para um código válido durante o dia", () => {
			const weatherCondition = weatherManager.getWeatherCondition(
				0,
				false
			);
			expect(weatherCondition).toBe("Céu limpo, sem nuvens ☀️");
		});

		it("deve retornar a condição climática correta para um código válido durante a noite", () => {
			const weatherCondition = weatherManager.getWeatherCondition(
				0,
				true
			);
			expect(weatherCondition).toBe("Céu limpo, sem nuvens 🌙");
		});

		it("deve retornar condição desconhecida para um código inválido", () => {
			const weatherCondition = weatherManager.getWeatherCondition(
				999,
				false
			);
			expect(weatherCondition).toBe("Condição desconhecida ❌");
		});

		it("deve retornar descrições corretas para diferentes códigos", () => {
			expect(weatherManager.getWeatherCondition(3, false)).toBe(
				"Bastante nublado ☁️"
			);
			expect(weatherManager.getWeatherCondition(61, false)).toBe(
				"Chuva leve 🌧️"
			);
			expect(weatherManager.getWeatherCondition(95, false)).toBe(
				"Tempestade com trovões 🌩️"
			);
		});
	});
});
