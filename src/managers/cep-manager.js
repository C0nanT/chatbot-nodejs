class CepManager {
    constructor() {
        this.isValid = false;
        this.cep = "";
    }
    
    /**
     * @description Valida se o CEP tem 8 digitos
     * @param {string} cep - O CEP a ser validado
     * @return {boolean} - Retorna true se o CEP for válido, caso contrário false
     */
   
    validateCep(cep) {
        this.isValid = /^\d{8}$/.test(cep);
        return this.isValid;
    }

    /**
     * @description Define o CEP
     * @param {string} cep - O CEP a ser definido
     * @return {void}
     */
    setCep(cep) {
        this.cep = cep.replace(/\D/g, '');
    }

    /**
     * @description Retorna o CEP definido
     * @return {string} - O CEP definido
     */
    getCep() {
        return this.cep;
    }
}
module.exports = { CepManager };
