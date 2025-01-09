const fs = require('fs');
const path = require('path');
const Logger = require('../lib/logger');
const { expect } = require('chai');
const os = require('os');

describe('Logger', function () {
  const logFile = path.resolve(__dirname, 'test.log');
  
  beforeEach(() => {
    // Clean up before each test
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile);
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (fs.existsSync(logFile)) {
      fs.unlinkSync(logFile);
    }
  });

  // 1. should log info messages correctly
  it('should log info messages correctly', function () {
    const logger = new Logger({ logFile });
    const message = 'This is an info log';
    
    logger.info(message);
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include('INFO: ' + message); // Ensuring uppercase 'INFO'
  });

  // 2. should log warn messages correctly
  it('should log warn messages correctly', function () {
    const logger = new Logger({ logFile });
    const message = 'This is a warn log';
    
    logger.warn(message);
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include('WARN: ' + message); // Ensuring uppercase 'WARN'
  });

  // 3. should log error messages correctly
  it('should log error messages correctly', function () {
    const logger = new Logger({ logFile });
    const message = 'This is an error log';
    
    logger.error(message);
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include('ERROR: ' + message); // Ensuring uppercase 'ERROR'
  });

  // 4. should log debug messages correctly
  it('should log debug messages correctly', function () {
    const logger = new Logger({ logFile });
    const message = 'This is a debug log';
    
    logger.debug(message);
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include('DEBUG: ' + message); // Ensuring uppercase 'DEBUG'
  });

  // 5. should create log file if it doesn't exist
  it('should create log file if it doesn\'t exist', function () {
    const logger = new Logger({ logFile });
    const message = 'This is a test log';
    
    logger.info(message);
    
    const logExists = fs.existsSync(logFile);
    expect(logExists).to.be.true;
  });

  // 6. should append to the log file
  it('should append to the log file', function () {
    const logger = new Logger({ logFile });
    const message1 = 'First log entry';
    const message2 = 'Second log entry';
    
    logger.info(message1);
    logger.info(message2);
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include(message1);
    expect(logContent).to.include(message2);
  });

  // 7. should handle multiple log entries
  it('should handle multiple log entries', function () {
    const logger = new Logger({ logFile });
    const message1 = 'Log entry 1';
    const message2 = 'Log entry 2';
    
    logger.info(message1);
    logger.info(message2);
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include(message1);
    expect(logContent).to.include(message2);
  });

  // 8. should use default file path if none provided
  it('should use default file path if none provided', function () {
    const logger = new Logger({});
    expect(logger.logFile).to.equal(path.join(__dirname, 'logs', 'test.log'));
  });

  // 9. should log messages without including the level
  it('should log messages without including the level', function () {
    const logger = new Logger({ logFile, level: 'none' });
    const message = 'Log without level test';
    
    logger.info(message);
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include(message);
  });

  // 10. should rate-limit log writes
  it('should rate-limit log writes', function (done) {
    const logger = new Logger({ logFile, rateLimitPeriod: 1000 });
    const message = 'Rate-limited log test';
    
    logger.info(message);
    logger.info(message); // Should be ignored as it's within the rate limit
    
    setTimeout(() => {
      const logContent = fs.readFileSync(logFile, 'utf-8');
      const messageCount = (logContent.match(new RegExp(message, 'g')) || []).length;
      expect(messageCount).to.equal(1); // Only one message should be logged
      done();
    }, 1500);
  });

  // 11. should clear logs correctly
  it('should clear logs correctly', function () {
    const logger = new Logger({ logFile });
    const message = 'Log before clear';
    
    logger.info(message);
    const logContentBeforeClear = fs.readFileSync(logFile, 'utf-8');
    expect(logContentBeforeClear).to.include(message);
    
    // Clear the logs
    logger.clearLogs();
    
    const logContentAfterClear = fs.readFileSync(logFile, 'utf-8');
    expect(logContentAfterClear).to.be.empty; // Log file should be empty after clear
  });

  // 12. should overwrite logs if cleared and then written again
  it('should overwrite logs if cleared and then written again', function () {
    const logger = new Logger({ logFile });
    const messageBeforeClear = 'Log before clear';
    const messageAfterClear = 'Log after clear';
    
    // Write a log, clear it, and then write again
    logger.info(messageBeforeClear);
    logger.clearLogs();
    logger.info(messageAfterClear);
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    expect(logContent).to.include(messageAfterClear);
    expect(logContent).to.not.include(messageBeforeClear);
  });

  // 13. should handle logging in JSON format
  it('should handle logging in JSON format', function () {
    const logger = new Logger({ logFile });
    const message = 'JSON formatted log test';
    
    logger.logAsJson('info', message);
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    const logJson = JSON.parse(logContent.trim());
    expect(logJson).to.have.property('level', 'info');
    expect(logJson).to.have.property('message', message);
    expect(logJson).to.have.property('timestamp');
  });
});
