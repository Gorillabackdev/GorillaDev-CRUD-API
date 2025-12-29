const http = require('http');

// Get arguments from the command line
// Usage: node add_product_cli.js "Name" Price "Description"
const name = process.argv[2];
const price = parseFloat(process.argv[3]);
const description = process.argv[4];

if (!name || !price) {
    console.log('Usage: node add_product_cli.js <name> <price> [description]');
    console.log('Example: node add_product_cli.js "Coffee Mug" 12.99 "Ceramic mug"');
    process.exit(1);
}

const postData = JSON.stringify({
    name,
    price,
    description: description || ''
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/products',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    res.pipe(process.stdout);
});

req.on('error', (e) => console.error(`Problem with request: ${e.message}`));
req.write(postData);
req.end();