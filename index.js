const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

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

// 1. Create a product
app.post('/products', (req, res) => {
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
app.get('/products', (req, res) => {
    res.json(products);
});

// 3. Get a product by ID
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
});

// 4. Update a product
app.put('/products/:id', (req, res) => {
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
app.delete('/products/:id', (req, res) => {
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