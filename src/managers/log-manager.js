const fs = require('fs');

class LogManager {
    constructor() {
        this.ensureLogFilesExist();
    }

    ensureLogFilesExist() {
        const logPaths = ['logs/access.log', 'logs/errors.log'];

        logPaths.forEach(path => {
            const dir = path.substring(0, path.lastIndexOf('/'));
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            if (!fs.existsSync(path)) {
                fs.writeFileSync(path, '');
            }
        });
    }

    logAccess(message) {
        const logEntry = `[${new Date().toISOString()}] - ${message}\n`;
        fs.appendFileSync('logs/access.log', logEntry);
    }

    logError(errorMessage) {
        const logEntry = `[${new Date().toISOString()}] - ${errorMessage}\n`;
        fs.appendFileSync('logs/errors.log', logEntry);
    }
}
module.exports = { LogManager };