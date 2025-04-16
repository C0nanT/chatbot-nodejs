const axios = require("axios");
const { LogManager } = require("../managers/log-manager");

class ApiService {
	constructor() {
		this.viaCepBaseUrl = "https://viacep.com.br/ws";
		this.openMeteoBaseUrl = "https://api.open-meteo.com/v1/forecast";
		this.geocodingBaseUrl = "https://geocoding-api.open-meteo.com/v1/search";

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

}

module.exports = { ApiService };
