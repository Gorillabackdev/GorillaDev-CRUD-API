const http = require('http');

console.log('Checking server status on http://localhost:3000...');

const req = http.get('http://localhost:3000/products', (res) => {
    console.log(`\u2705 Server is running! Received Status Code: ${res.statusCode}`);
    
    if (res.statusCode === 401) {
        console.log('   \u2705 Note: Server is protected (Authentication enabled). This is expected behavior.');
        return;
    }

    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const products = JSON.parse(data);
            console.log(`   Data check: Successfully retrieved ${products.length} products.`);
        } catch (e) {
            console.log('   Warning: Could not parse response JSON.');
        }
    });
});

req.on('error', (err) => {
    console.error(`\u274C Server is NOT reachable.`);
    console.error(`Error details: ${err.message}`);
    console.error('Tip: Ensure you have run "npm start" in a separate terminal window.');
});