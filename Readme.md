# Log-Vani

A robust and customizable logging library for Node.js applications. `log-vani` supports multiple log levels, customizable formats, color-coded output, JSON logging, and integration with custom log transports, making it suitable for both development and production environments.

## Installation

Install `log-vani` using npm:

```bash
npm install log-vani
```

## Usage

### Basic Usage

```javascript
const Logger = require("log-vani");

// Create a new Logger instance
const logger = new Logger({
  logFile: "path/to/your/logfile.log", // Path to the log file
});

// Log messages with different levels
logger.info("This is an info message");
logger.warn("This is a warning message");
logger.error("This is an error message");
logger.debug("This is a debug message");
```

### Log Levels

- `info`: Informational messages
- `warn`: Warning messages
- `error`: Error messages
- `debug`: Debugging messages

### Custom Log Formats

You can customize the log format using the `format` option. The default format is:

```text
[{level}] {message} at {timestamp}
```

You can replace this format with your custom string containing placeholders:

- `{level}`: The log level (e.g., INFO, WARN, ERROR, DEBUG).
- `{message}`: The log message.
- `{timestamp}`: The current timestamp.

#### Example of Custom Format

```javascript
const logger = new Logger({
  logFile: "path/to/your/logfile.log",
  format: "{level} - {message} at {timestamp} from {hostname}",
});
```

### Color-Coded Logs

Each log level is color-coded for better readability in the terminal. The default colors are:

- `info`: Green
- `warn`: Yellow with Magenta background
- `error`: Red with White background
- `debug`: Cyan

You can customize the colors in the terminal output.

### Custom Transport

You can send logs to external services (e.g., a logging server) using the `customTransport` option. The transport must implement a `send` method.

#### Example

```javascript
const logger = new Logger({
  logFile: "path/to/your/logfile.log",
  customTransport: {
    send: function (log) {
      console.log("Sending log to external service:", log);
    },
  },
});

logger.info("This log will be sent to an external service");
```

### JSON Logging

If you prefer logging in JSON format, you can use the `logAsJson` method. This is especially useful for log aggregation systems.

```javascript
logger.logAsJson("info", "This is a JSON log entry");
```

### Clearing Logs

Clear the log file using the `clearLogs` method. This is useful when you need to reset logs between runs.

```javascript
logger.clearLogs();
```

### Rate Limiting

Control the rate at which logs are written using the `rateLimit` option. This prevents spamming logs in high-frequency scenarios.

```javascript
const logger = new Logger({
  rateLimit: 2000, // Minimum 2 seconds between logs
});
```

## Full Example

```javascript
const Logger = require("log-vani");

// Create a new Logger instance with full configuration
const logger = new Logger({
  logFile: "logs/app.log",
  rateLimit: 2000, // Log rate limiting in milliseconds
  format: "[{level}] {message} at {timestamp}",
  customTransport: {
    send: function (log) {
      // Send log to an external service
      console.log("Sending log:", log);
    },
  },
});

logger.info("Application started");
logger.warn("This is a warning");
logger.error("An error occurred");
logger.debug("Debugging details");
logger.logAsJson("info", "JSON formatted log entry");
logger.clearLogs();
```

## API

### `new Logger(options)`

Creates a new logger instance.

#### Options:

- `logFile` (string): Path to the log file. Default is `test.log`.
- `rateLimit` (number): Minimum time between log writes in milliseconds. Default is `1000ms`.
- `format` (string): Custom format for log messages. Placeholders include `{level}`, `{message}`, `{timestamp}`.
- `customTransport` (object): An object with a `send` method for sending logs to external systems.

### Methods:

- `info(message)`: Logs an informational message.
- `warn(message)`: Logs a warning message.
- `error(message)`: Logs an error message.
- `debug(message)`: Logs a debug message.
- `logAsJson(level, message)`: Logs a message in JSON format.
- `clearLogs()`: Clears the log file.

## Features

- **Multiple Log Levels**: Supports `info`, `warn`, `error`, and `debug` log levels.
- **Custom Formats**: Define custom formats for your log messages.
- **Color-Coded Logs**: Terminal output is color-coded for clarity.
- **Custom Transport**: Send logs to external systems.
- **JSON Logging**: Log entries in JSON format.
- **File-Based Logging**: Logs are written to a specified file.
- **Rate Limiting**: Prevent excessive log writes in high-frequency scenarios.
- **Clear Logs**: Reset the log file when needed.

## License

MIT License
