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