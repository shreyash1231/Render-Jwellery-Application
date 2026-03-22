const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/app.log');

function logToFile(logObj) {
  const logLine = JSON.stringify(logObj) + '\n';
  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
}

module.exports = { logToFile, logFilePath };
