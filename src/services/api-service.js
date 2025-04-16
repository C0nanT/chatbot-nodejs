const axios = require("axios");
const { LogManager } = require("../managers/log-manager");

class ApiService {
	constructor() {
		this.viaCepBaseUrl = "https://viacep.com.br/ws";
		this.openMeteoBaseUrl = "https://api.open-meteo.com/v1/forecast";
		this.geocodingBaseUrl =
			"https://geocoding-api.open-meteo.com/v1/search";
			
		this.logManager = new LogManager();
	}

	/**
	 * @description Faz uma consulta ao ViaCEP para obter informações de endereço a partir do CEP
	 * @param {string} cep - O CEP a ser consultado
	 * @return {Promise<Object>} - Os dados do endereço correspondente ao CEP
	 */
	async consultCep(cep) {
		try {
			const formattedCep = cep.replace(/\D/g, "");

			const response = await axios.get(
				`${this.viaCepBaseUrl}/${formattedCep}/json/`
			);

			if (response.data.erro) {
				return {
					error: "CEP não encontrado. Verifique o número e tente novamente.",
				};
			}

			this.logManager.logAccess(
				`Consulta de CEP realizada com sucesso: ${formattedCep}`
			);

			return response.data;
		} catch (error) {
			this.logManager.logError(error.message);
			throw new Error("Failed to fetch CEP data");
		}
	}

	/**
	 * @description Faz uma consulta ao Open Meteo para obter as coordenadas geográficas de uma cidade
	 * @param {string} city - O nome da cidade a ser consultada
	 * @return {Promise<Object>} - As coordenadas geográficas da cidade
	 * */
    async getCoordinates(city) {
        const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
            params: {
                name: city,
                count: 1,
                language: 'pt',
                format: 'json'
            }
        });

        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            return { error: 'Cidade não encontrada. Verifique o nome e tente novamente. ' };
        }

        const { latitude, longitude } = geoResponse.data.results[0];
        return { latitude, longitude };
    }

	/**
	 * @description Faz uma consulta ao Open Meteo para obter as informações climáticas atuais
	 * @param {number} latitude - A latitude da localização
	 * @param {number} longitude - A longitude da localização
	 * @return {Promise<Object>} - As informações climáticas atuais
	 * */
	async getWeather(latitude, longitude) {
		try {
			const weatherResponse = await axios.get(this.openMeteoBaseUrl, {
				params: {
					latitude,
					longitude,
					current: "temperature_2m,weather_code",
					daily: "temperature_2m_max,temperature_2m_min,weather_code",
					timezone: "America/Sao_Paulo",
					forecast_days: 1,
				},
			});

			return weatherResponse.data;
		} catch (error) {
			console.error("Error fetching weather data:", error.message);
			throw new Error("Failed to fetch weather data");
		}
	}
}

module.exports = { ApiService };
