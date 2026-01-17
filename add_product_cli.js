<<<<<<< HEAD
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

// Helper function to make HTTP requests
function makeRequest(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const jsonBody = body ? JSON.stringify(body) : null;
        const headers = { 'Content-Type': 'application/json' };
        if (jsonBody) headers['Content-Length'] = Buffer.byteLength(jsonBody);
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const req = http.request({
            hostname: 'localhost', port: 3000, path, method, headers
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({ status: res.statusCode, body: data ? JSON.parse(data) : {} }));
        });

        req.on('error', reject);
        if (jsonBody) req.write(jsonBody);
        req.end();
    });
}

async function main() {
    try {
        // 1. Login
        console.log('Authenticating as admin...');
        const login = await makeRequest('POST', '/login', { username: 'admin', role: 'admin' });
        
        if (login.status !== 200) {
            console.error('Failed to login:', login.body);
            return;
        }
        const token = login.body.accessToken;

        // 2. Add Product
        console.log('Adding product...');
        const productData = { name, price, description: description || '' };
        const result = await makeRequest('POST', '/products', productData, token);

        console.log(`Status Code: ${result.status}`);
        console.log('Response:', result.body);

    } catch (err) {
        console.error('Error:', err.message);
    }
}

main();
=======
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
>>>>>>> bfc61208343fd448e054cbf3128132d7bf2e693c
