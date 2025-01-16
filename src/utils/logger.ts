// src/utils/logger.ts

const logLevels = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

let currentLevel = logLevels.INFO;

const setLogLevel = (level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR') => {
  currentLevel = level
}

const log = (level: string, message: string, ...args: any[]) => {
    if (Object.keys(logLevels).indexOf(level) < Object.keys(logLevels).indexOf(currentLevel) ) return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    switch (level) {
        case logLevels.DEBUG:
            console.debug(logMessage, ...args);
            break;
        case logLevels.INFO:
            console.info(logMessage, ...args);
            break;
        case logLevels.WARN:
            console.warn(logMessage, ...args);
            break;
        case logLevels.ERROR:
            console.error(logMessage, ...args);
            break;
        default:
            console.log(logMessage, ...args);
    }
};

export const logger = {
    debug: (message: string, ...args: any[]) => log(logLevels.DEBUG, message, ...args),
    info: (message: string, ...args: any[]) => log(logLevels.INFO, message, ...args),
    warn: (message: string, ...args: any[]) => log(logLevels.WARN, message, ...args),
    error: (message: string, ...args: any[]) => log(logLevels.ERROR, message, ...args),
    setLogLevel
};