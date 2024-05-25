const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        logPerformanceTiming(timingData) {
          const logPath = path.join(__dirname, 'performance_logs.json');
          let logs = [];

          if (fs.existsSync(logPath)) {
            logs = JSON.parse(fs.readFileSync(logPath));
          }

          logs.push(timingData);
          fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

          return null; // Cypress expects a return value for the task
        },
        generatePerformanceReport() {
          const logPath = path.join(__dirname, 'performance_logs.json');
          const reportPath = path.join(__dirname, 'performance_report.html');
          const logs = JSON.parse(fs.readFileSync(logPath));

          let reportContent = `
            <html>
            <head>
              <title>Performance Report</title>
            </head>
            <body>
              <h1>Performance Report</h1>
              <table border="1">
                <tr>
                  <th>URL</th>
                  <th>Load Time (ms)</th>
                  <th>API Response Time (ms)</th>
                  <th>Navigation Start</th>
                  <th>Load Event End</th>
                  <th>Test Duration (ms)</th>
                </tr>`;

          logs.forEach(log => {
            const { url, performanceTiming, loadTime, apiResponseTime, testDuration } = log;
            const { navigationStart, loadEventEnd } = performanceTiming || {};

            reportContent += `
              <tr>
                <td>${url || 'N/A'}</td>
                <td>${loadTime || 'N/A'}</td>
                <td>${apiResponseTime || 'N/A'}</td>
                <td>${navigationStart || 'N/A'}</td>
                <td>${loadEventEnd || 'N/A'}</td>
                <td>${testDuration || 'N/A'}</td>
              </tr>`;
          });

          reportContent += `
              </table>
            </body>
            </html>`;

          fs.writeFileSync(reportPath, reportContent);
          return null;
        }
      });
      return config;
    }
  }
});
