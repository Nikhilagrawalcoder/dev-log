const fs = require('fs');
const path = require('path');
const chai = require('chai');
const sinon = require('sinon');
const Logger = require('../lib/logger');  // Adjust the path based on where your Logger class is located
const { expect } = chai;

describe('Logger Class - Terminal Output and File Writing', function () {
  let logFile;
  let logger;
  let consoleSpy;

  beforeEach(() => {
    logFile = path.join(__dirname, 'test.log');
    logger = new Logger({
      logFile,
      colors: {
        info: 'blue',
        warn: 'yellow',
        error: 'red',
        debug: 'green',
      },
    });
    // Spy on console.log to capture the colored terminal output
    consoleSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    // Clean up log file and remove the spy after each test
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile);
    }
    consoleSpy.restore();
  });

  it('should log info messages in blue in terminal and write to the log file', () => {
    const message = 'This is an info message';
    logger.info(message);

    // Verify that the message is written in the log file
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include(message);

    // Verify that the colored output was printed to terminal (console.log)
    const consoleOutput = consoleSpy.getCall(0).args[0];
    expect(consoleOutput).to.include(message);
    // Checking that the color applied (blue for info)
    expect(consoleOutput).to.have.string('\x1b[34m'); // ANSI code for blue color
  });

  it('should log warning messages in yellow in terminal and write to the log file', () => {
    const message = 'This is a warning message';
    logger.warn(message);

    // Verify that the message is written in the log file
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include(message);

    // Verify that the colored output was printed to terminal (console.log)
    const consoleOutput = consoleSpy.getCall(0).args[0];
    expect(consoleOutput).to.include(message);
    // Checking that the color applied (yellow for warn)
    expect(consoleOutput).to.have.string('\x1b[33m'); // ANSI code for yellow color
  });

  it('should log error messages in red in terminal and write to the log file', () => {
    const message = 'This is an error message';
    logger.error(message);

    // Verify that the message is written in the log file
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include(message);

    // Verify that the colored output was printed to terminal (console.log)
    const consoleOutput = consoleSpy.getCall(0).args[0];
    expect(consoleOutput).to.include(message);
    // Checking that the color applied (red for error)
    expect(consoleOutput).to.have.string('\x1b[31m'); // ANSI code for red color
  });

  it('should log debug messages in green in terminal and write to the log file', () => {
    const message = 'This is a debug message';
    logger.debug(message);

    // Verify that the message is written in the log file
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include(message);

    // Verify that the colored output was printed to terminal (console.log)
    const consoleOutput = consoleSpy.getCall(0).args[0];
    expect(consoleOutput).to.include(message);
    // Checking that the color applied (green for debug)
    expect(consoleOutput).to.have.string('\x1b[32m'); // ANSI code for green color
  });

  it('should apply default color if custom color is not provided for a log level', () => {
    const message = 'This is a default color message';
    const defaultLogger = new Logger({ logFile });
    defaultLogger.log('info', message);

    // Verify that the message is written in the log file
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include(message);

    // Verify that the colored output was printed to terminal (console.log)
    const consoleOutput = consoleSpy.getCall(0).args[0];
    expect(consoleOutput).to.include(message);
    // Check default color for 'info' (blue)
    expect(consoleOutput).to.have.string('\x1b[34m'); // ANSI code for blue color
  });
});
