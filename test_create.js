<<<<<<< HEAD
const http = require('http');

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

async function run() {
    try {
        // Login
        const login = await makeRequest('POST', '/login', { username: 'admin', role: 'admin' });
        const token = login.body.accessToken;

        // Create
        const postData = {
            name: 'Gaming Mouse',
            price: 29.99,
            description: 'High precision optical mouse'
        };
        
        const result = await makeRequest('POST', '/products', postData, token);
        console.log(`Status Code: ${result.status}`);
        console.log(result.body);

    } catch (e) {
        console.error(e.message);
    }
}
run();
=======
const http = require('http');

const postData = JSON.stringify({
    name: 'Gaming Mouse',
    price: 29.99,
    description: 'High precision optical mouse'
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

req.write(postData);
req.end();
>>>>>>> bfc61208343fd448e054cbf3128132d7bf2e693c
