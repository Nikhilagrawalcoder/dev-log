const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // For coloring the logs

class Logger {
  constructor({
    logFile,
    rateLimit = 1000,
    format = '[{level}] {message} at {timestamp}',
    customTransport,
  } = {}) {
    const projectDir = path.resolve(process.cwd());
    this.logFile = logFile || path.join(projectDir, 'test.log');
    this.rateLimit = rateLimit;
    this.format = format;
    this.customTransport = customTransport;
    this.lastLogTime = null;

    this._ensureLogFile();
  }

  _ensureLogFile() {
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '');
      console.log(chalk.green(`Log file created at: ${this.logFile}`));
    }
  }

  _getColorFunction(level) {
    // Fixed color scheme
    const colorScheme = {
      info: chalk.green.bgBlack,
      warn: chalk.yellow.bgMagenta,
      error: chalk.red.bgWhite,
      debug: chalk.cyan.bgBlack,
    };

    return colorScheme[level] || chalk.white.bgBlack;
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const formattedMessage = this.format
      .replace('{level}', level.toUpperCase())
      .replace('{message}', message)
      .replace('{timestamp}', timestamp);

    // Get the color function for the terminal output
    const colorFunc = this._getColorFunction(level);

    // Print the colored message to the terminal
    console.log(colorFunc(formattedMessage));

    // Prepare the log file message with labels
    const logFileMessage = `[${level.toUpperCase()}] ${message} at ${timestamp}`;

    // Write the log file message (no colors, just plain text)
    fs.appendFileSync(this.logFile, logFileMessage + '\n');

    // If custom transport is provided, use it
    if (this.customTransport) {
      this.customTransport.send({ level, message, timestamp });
    }
  }

  info(message) {
    this.log('info', message);
  }

  warn(message) {
    this.log('warn', message);
  }

  error(message) {
    this.log('error', message);
  }

  debug(message) {
    this.log('debug', message);
  }

  clearLogs() {
    if (fs.existsSync(this.logFile)) {
      fs.truncateSync(this.logFile, 0);
      console.log(chalk.green('Log file cleared.'));
    } else {
      console.warn(chalk.yellow(`Log file "${this.logFile}" does not exist, skipping clear.`));
    }
  }

  logAsJson(level, message) {
    const timestamp = new Date().toISOString();
    const logObj = { level, message, timestamp };

    if (this.customTransport) {
      this.customTransport.send(logObj);
    }

    fs.appendFileSync(this.logFile, JSON.stringify(logObj) + '\n');
  }
}

module.exports = Logger;
