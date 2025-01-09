const fs = require('fs');
const path = require('path');
const chalk = require('chalk');  // For coloring the logs

class Logger {
  constructor({
    logFile,
    rateLimit = 1000,
    format = '{level}: {message} at {timestamp}',
    customTransport,
    colors = {
      info: 'blue',
      warn: 'yellow',
      error: 'red',
      debug: 'green'
    }
  } = {}) {
    const projectDir = path.resolve(process.cwd());
    this.logFile = logFile || path.join(projectDir, 'test.log');
    this.rateLimit = rateLimit;
    this.format = format;
    this.customTransport = customTransport;
    this.colors = colors; // Custom colors for log levels
    this.lastLogTime = null;

    this._ensureLogFile();
  }

  _ensureLogFile() {
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '');
      console.log(`Log file created at: ${this.logFile}`);
    }
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const formattedMessage = this.format
      .replace('{level}', level.toUpperCase())
      .replace('{message}', message)
      .replace('{timestamp}', timestamp);

    // Apply colors based on log level from `this.colors`
    const color = this.colors[level] ? this.colors[level] : 'white';
    const coloredMessage = chalk[color](formattedMessage);

    // Print the colored message to the terminal
    console.log(coloredMessage);

    // If custom transport is provided, use it
    if (this.customTransport) {
      this.customTransport.send({ level, message, timestamp });
    }

    // Write to the log file
    fs.appendFileSync(this.logFile, coloredMessage + '\n');
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
    } else {
      console.warn(`Log file "${this.logFile}" does not exist, skipping clear.`);
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
