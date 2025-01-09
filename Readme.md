# Log-Vani

A simple, customizable logging library for Node.js applications. `log-vani` supports multiple log levels, customizable formats, colored output, and custom log transports, making it ideal for development environments.

## Installation

You can install `log-vani` using npm:

```bash
npm install log-vani
```

## Usage

Once installed, you can require and configure the logger in your Node.js application.

### Basic Usage

```javascript
const Logger = require("log-vani");

// Create a new Logger instance
const logger = new Logger({
  logFile: "path/to/your/logfile.log",  The log file location
  colors: {
    info: "cyan", // Custom color for 'info' logs
    warn: "magenta", // Custom color for 'warn' logs
    error: "red", // Custom color for 'error' logs
    debug: "gray", // Custom color for 'debug' logs
  },
});

// Log messages with different levels
logger.info("This is an info message");
logger.warn("This is a warning message");
logger.error("This is an error message");
logger.debug("This is a debug message");
```

### Log Levels

- `info`: Informational messages (blue by default)
- `warn`: Warning messages (yellow by default)
- `error`: Error messages (red by default)
- `debug`: Debugging messages (green by default)

Each log level is color-coded by default for better readability. You can customize the colors and format as needed.

### Custom Log Formats

You can customize the log format using the `format` option in the constructor. By default, the log format is:

```text
{level}: {message} at {timestamp}
```

You can replace the format string with your custom format. For example, you can include additional information like the hostname, user ID, etc.

### Example of Custom Format

```javascript
const logger = new Logger({
  logFile: "path/to/your/logfile.log",
  format: "{level} - {message} at {timestamp} from {hostname}",
});
```

### Custom Transport

You can also integrate the logger with external services (such as sending logs to a remote server) by using the `customTransport` option. Provide a custom transport that has a `send` method.

```javascript
const logger = new Logger({
  logFile: "path/to/your/logfile.log",
  customTransport: {
    send: function (log) {
      // Send log to an external system, e.g., a remote logging server
      console.log("Sending log to external service:", log);
    },
  },
});

logger.info("This log will be sent to an external service");
```

### JSON Logging

If you prefer to log in JSON format, you can use the `logAsJson` method. This is especially useful for log aggregation systems.

```javascript
logger.logAsJson("info", "This is a JSON log entry");
```

### Clear Logs

You can clear the log file using the `clearLogs` method. This is useful if you want to clear logs between runs or after a certain period of time.

```javascript
logger.clearLogs();
```

### Example: Full Configuration

```javascript
const Logger = require("log-vani");

// Create a new Logger instance with all options
const logger = new Logger({
  logFile: "logs/app.log",
  rateLimit: 2000, // Log rate limiting in milliseconds
  format: "{level}: {message} at {timestamp} from {hostname}",
  colors: {
    info: "cyan",
    warn: "magenta",
    error: "red",
    debug: "green",
  },
  customTransport: {
    send: function (log) {
      // Send log to an external service (e.g., a monitoring system)
      console.log("Sending log:", log);
    },
  },
});

logger.info("Application started");
logger.error("An error occurred");
logger.debug("Debugging the app");
```

## Features

- **Multiple Log Levels**: Supports `info`, `warn`, `error`, and `debug` log levels.
- **Custom Log Formats**: Fully customizable log format for timestamp, level, and message.
- **Color-Coded Logs**: Customizable colors for each log level.
- **Custom Transport**: Easily send logs to external systems or services.
- **JSON Logging**: Log entries can be written in structured JSON format.
- **Clear Logs**: Clears the log file if required.
- **File-Based Logging**: Logs are written to a specified file (defaults to `test.log`).

## Installation

To install `log-vani`, use the following npm command:

```bash
npm install log-vani
```

## API

### `new Logger(options)`

Creates a new logger instance. The available options are:

- `logFile` (string): The path of the log file (default is `test.log`).
- `rateLimit` (number): The minimum time between log writes (default is `1000ms`).
- `format` (string): A string to define the log message format. Available placeholders: `{level}`, `{message}`, `{timestamp}`, `{hostname}`.
- `colors` (object): Custom colors for each log level. Default is:
  ```javascript
  {
    info: 'blue',
    warn: 'yellow',
    error: 'red',
    debug: 'green'
  }
  ```
- `customTransport` (object): A custom transport with a `send` method for sending logs externally.

### `Logger.info(message)`

Logs an info-level message.

### `Logger.warn(message)`

Logs a warning-level message.

### `Logger.error(message)`

Logs an error-level message.

### `Logger.debug(message)`

Logs a debug-level message.

### `Logger.clearLogs()`

Clears the log file.

### `Logger.logAsJson(level, message)`

Logs the message in JSON format.

## License

MIT License
