require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || '08033632300';

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve index.html for the root route to debug issues
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error serving index.html:', err);
            res.status(404).send('Error: Could not find public/index.html. Please ensure the file exists in the "public" folder.');
        }
    });
});

// In-memory storage for products
let products = [
    { id: 1, name: 'Laptop', price: 999.99, description: 'High performance laptop' },
    { id: 2, name: 'Headphones', price: 199.99, description: 'Noise cancelling' },
    { id: 3, name: 'Smartphone', price: 699.99, description: 'Latest model smartphone' },
    { id: 4, name: 'Tablet', price: 399.99, description: '10-inch display tablet' },
    { id: 5, name: 'Smartwatch', price: 249.99, description: 'Fitness tracking smartwatch' },
];
let nextId = 6;

// Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // No token present

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user;
        next();
    });
}

// Authorization Middleware (Role-based)
function authorizeRole(requiredRole) {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }
        next();
    };
}

// Login Route (Generate Token)
app.post('/login', (req, res) => {
    // In a real application, you would validate credentials against a database here.
    // For this demo, we accept any username and role provided in the body.
    const { username, role } = req.body;

    if (!username || !role) {
        return res.status(400).json({ error: 'Username and role are required' });
    }

    const user = { username, role };
    const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
});

// 1. Create a product
app.post('/products', authenticateToken, authorizeRole('admin'), (req, res) => {
    const { name, price, description } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const newProduct = {
        id: nextId++,
        name,
        price,
        description: description || ''
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 2. Get all products
app.get('/products', authenticateToken, (req, res) => {
    res.json(products);
});

// 3. Get a product by ID
app.get('/products/:id', authenticateToken, (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
});

// 4. Update a product
app.put('/products/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const { name, price, description } = req.body;

    products[productIndex] = {
        ...products[productIndex],
        name: name !== undefined ? name : products[productIndex].name,
        price: price !== undefined ? price : products[productIndex].price,
        description: description !== undefined ? description : products[productIndex].description
    };

    res.json(products[productIndex]);
});

// 5. Delete a product
app.delete('/products/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products.splice(productIndex, 1);
    res.json({ message: 'Product deleted successfully', product: deletedProduct[0] });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});