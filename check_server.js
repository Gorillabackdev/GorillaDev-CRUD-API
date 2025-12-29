const http = require('http');

console.log('Checking server status on http://localhost:3000...');

const req = http.get('http://localhost:3000/products', (res) => {
    console.log(`\u2705 Server is running! Received Status Code: ${res.statusCode}`);
    res.resume();
});

req.on('error', (err) => {
    console.error(`\u274C Server is NOT reachable.`);
    console.error(`Error details: ${err.message}`);
    console.error('Tip: Ensure you have run "npm start" in a separate terminal window.');
});