const http = require('http');

// Helper function to make HTTP requests without external libraries
function makeRequest(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const jsonBody = body ? JSON.stringify(body) : null;
        const headers = {
            'Content-Type': 'application/json',
        };

        if (jsonBody) {
            headers['Content-Length'] = Buffer.byteLength(jsonBody);
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: headers
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        body: data ? JSON.parse(data) : {}
                    });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (jsonBody) {
            req.write(jsonBody);
        }
        req.end();
    });
}

async function runTests() {
    console.log('Starting CRUD API Tests...\n');

    try {
        // 0. Login to get Access Token
        console.log('0. Authenticating (POST /login)...');
        const loginData = { username: 'adminUser', role: 'admin' };
        const login = await makeRequest('POST', '/login', loginData);
        
        if (login.status !== 200 || !login.body.accessToken) {
            console.log('   \u274C FAILED to login. Aborting tests.');
            console.log(`      Debug Status: ${login.status}`);
            console.log(`      Debug Body: ${JSON.stringify(login.body)}`);
            return;
        }
        const token = login.body.accessToken;
        console.log('   \u2705 Logged in successfully.\n');

        // 1. GET All Products
        console.log('1. Testing GET /products (Read All)...');
        const getAll = await makeRequest('GET', '/products', null, token);
        console.log(`   Status: ${getAll.status}`);
        console.log(`   Items found: ${getAll.body.length}`);
        if (getAll.status === 200 && Array.isArray(getAll.body)) {
            console.log('   \u2705 PASSED\n');
        } else {
            console.log('   \u274C FAILED\n');
        }

        // 2. POST Create Product
        console.log('2. Testing POST /products (Create)...');
        const newProduct = { name: 'Test Widget', price: 25.50, description: 'A test widget' };
        const create = await makeRequest('POST', '/products', newProduct, token);
        console.log(`   Status: ${create.status}`);
        console.log(`   Created Item: ${JSON.stringify(create.body)}`);
        
        if (create.status === 201 && create.body.name === 'Test Widget') {
            console.log('   \u2705 PASSED\n');
        } else {
            console.log('   \u274C FAILED\n');
            return; // Stop if create fails
        }
        
        const createdId = create.body.id;

        // 3. GET Single Product
        console.log(`3. Testing GET /products/${createdId} (Read One)...`);
        const getOne = await makeRequest('GET', `/products/${createdId}`, null, token);
        console.log(`   Status: ${getOne.status}`);
        if (getOne.status === 200 && getOne.body.id === createdId) {
            console.log('   \u2705 PASSED\n');
        } else {
            console.log('   \u274C FAILED\n');
        }

        // 4. PUT Update Product
        console.log(`4. Testing PUT /products/${createdId} (Update)...`);
        const updateData = { price: 99.99 };
        const update = await makeRequest('PUT', `/products/${createdId}`, updateData, token);
        console.log(`   Status: ${update.status}`);
        console.log(`   Updated Price: ${update.body.price}`);
        if (update.status === 200 && update.body.price === 99.99) {
            console.log('   \u2705 PASSED\n');
        } else {
            console.log('   \u274C FAILED\n');
        }

        // 5. DELETE Product
        console.log(`5. Testing DELETE /products/${createdId} (Delete)...`);
        const del = await makeRequest('DELETE', `/products/${createdId}`, null, token);
        console.log(`   Status: ${del.status}`);
        if (del.status === 200) {
            console.log('   \u2705 PASSED\n');
        } else {
            console.log('   \u274C FAILED\n');
        }

        // 6. Verify Deletion
        console.log(`6. Verifying Deletion (GET /products/${createdId})...`);
        const verify = await makeRequest('GET', `/products/${createdId}`, null, token);
        console.log(`   Status: ${verify.status}`);
        if (verify.status === 404) {
            console.log('   \u2705 PASSED (Correctly returned 404)\n');
        } else {
            console.log('   \u274C FAILED (Item still exists)\n');
        }

        console.log('All tests completed successfully!');

    } catch (err) {
        console.error('Error running tests:', err.message);
        console.error('Ensure your server is running on port 3000 (npm start)');
    }
}

runTests();