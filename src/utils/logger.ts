// src/utils/logger.ts

const logger = {
    info: (message: string, ...args: any[]) => {
        if (import.meta.env.DEV) {
            console.info(`%c INFO: ${message}`, 'color: blue', ...args);
        }
    },
    warn: (message: string, ...args: any[]) => {
         if (import.meta.env.DEV) {
            console.warn(`%c WARN: ${message}`, 'color: orange', ...args);
        }
    },
    error: (message: string, ...args: any[]) => {
        if (import.meta.env.DEV) {
            console.error(`%c ERROR: ${message}`, 'color: red', ...args);
        }
    },
    debug: (message: string, ...args: any[]) => {
        if (import.meta.env.DEV) {
            console.debug(`%c DEBUG: ${message}`, 'color: gray', ...args);
        }
    },
};

export default logger;