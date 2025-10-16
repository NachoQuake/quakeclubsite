// Simple HTTP server for testing
const http = require('http');

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  console.log(`Received request for ${req.url}`);
  
  // Set the response headers
  res.writeHead(200, {'Content-Type': 'text/html'});
  
  // Send a simple HTML response
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Simple Test Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          line-height: 1.6;
        }
        h1 {
          color: #4285f4;
        }
      </style>
    </head>
    <body>
      <h1>Hello from Simple Test Server!</h1>
      <p>This is a basic HTTP server created with Node.js.</p>
      <p>Current time: ${new Date().toLocaleTimeString()}</p>
      <p>Requested URL: ${req.url}</p>
    </body>
    </html>
  `);
});

// Listen on port 8000
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});