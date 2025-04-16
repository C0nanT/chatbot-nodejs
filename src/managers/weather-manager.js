const { ApiService } = require("../services/api-service");

class WeatherManager {
    constructor() {
        this.city = "";
		this.apiService = new ApiService();
    }
    
    /**
     * @description Define a cidade
     * @param {string} city - A cidade a ser definida
     * @return {void}
     */
    setCity(city) {
        this.city = city;
    }

    /**
     * @description Retorna a cidade definida
     * @return {string} - A cidade definida
     */
    getCity() {
        return this.city;
    }

    /**
     * @description Faz uma consulta ao Open Meteo para obter os dados climáticos
     * @param {string} city - O nome da cidade a ser consultada
     * @return {Promise<Object>} - Os dados climáticos correspondentes à cidade
     * */
    async getWeatherData(){
        const coordinates = await this.apiService.getCoordinates(this.getCity());
        if (coordinates.error) {
            return coordinates;
        }

        const weatherData = await this.apiService.getWeather(coordinates.latitude, coordinates.longitude);
        
        if (weatherData.error) {
            return weatherData;
        }

        const timezoneOffset = weatherData.timezone_offset_seconds / 3600;
        const currentDate = new Date();
        const currentHour = (currentDate.getUTCHours() + timezoneOffset) % 24;
        const is_night = currentHour < 6 || currentHour > 18;
        const weather = {
            city: this.getCity(),
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            current_temperature: weatherData.current.temperature_2m,
            max_temperature: weatherData.daily.temperature_2m_max[0],
            min_temperature: weatherData.daily.temperature_2m_min[0],
            condition: this.getWeatherCondition(weatherData.current.weather_code, is_night),
            is_night: is_night,
        };

        return weather;
    }

	/**
	 * @description Mapeia os códigos de condição climática para suas descrições
	 * @param {number} code - O código da condição climática
     * @param {boolean} is_night - Indica se é noite ou dia
	 * @return {string} - A descrição da condição climática
	 * */
	getWeatherCondition(code, is_night) {
		const conditions = {
		  0: 'Céu limpo, sem nuvens ' + (is_night ? '🌙' : '☀️'),
		  1: 'Predominantemente claro ' + (is_night ? '🌙' : '☀️'),
		  2: 'Parcialmente nublado ☁️',
		  3: 'Bastante nublado ☁️',
		  45: 'Neblina 🌫️',
		  48: 'Neblina com geada 🌫️❄️',
		  51: 'Garoa leve 🌧️',
		  53: 'Garoa moderada 🌧️',
		  55: 'Garoa intensa 🌧️',
		  56: 'Garoa "congelante" leve 🌧️',
		  57: 'Garoa "congelante" intensa 🌧️',
		  61: 'Chuva leve 🌧️',
		  63: 'Chuva moderada 🌧️',
		  65: 'Chuva intensa 🌧️',
		  66: 'Chuva "congelante" leve 🌧️',
		  67: 'Chuva "congelante" intensa 🌧️',
		  71: 'Neve caindo levemente ❄️',
		  73: 'Neve caindo moderadamente ❄️',
		  75: 'Neve caindo de forma intensa ❄️',
		  77: 'Pequenos flocos de neve caindo ❄️',
		  80: 'Pancadas de chuva leves 🌧️',
		  81: 'Pancadas de chuva moderadas 🌧️',
		  82: 'Pancadas de chuva violentas 🌧️',
		  85: 'Pancadas de neve leves ❄️',
		  86: 'Pancadas de neve intensas ❄️',
		  95: 'Tempestade com trovões 🌩️',
		  96: 'Tempestade com trovões e granizo leve 🌩️',
		  99: 'Tempestade com trovões e granizo intenso 🌩️',
		};
		
		return conditions[code] || 'Condição desconhecida ❌';
	}
}
module.exports = { WeatherManager };
