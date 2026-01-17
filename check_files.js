<<<<<<< HEAD
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const indexFile = path.join(publicDir, 'index.html');

console.log('Checking file structure...');
console.log(`Looking for: ${indexFile}`);

if (fs.existsSync(indexFile)) {
    console.log('✅ SUCCESS: index.html found!');
} else {
    console.log('❌ ERROR: index.html NOT found.');
    console.log('------------------------------------------------');
    console.log('Files in your project folder:');
    fs.readdirSync(__dirname).forEach(file => console.log(` - ${file}`));
    
    if (fs.existsSync(publicDir)) {
        console.log('\nFiles inside "public" folder:');
        fs.readdirSync(publicDir).forEach(file => console.log(` - ${file}`));
    }
=======
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const indexFile = path.join(publicDir, 'index.html');

console.log('Checking file structure...');
console.log(`Looking for: ${indexFile}`);

if (fs.existsSync(indexFile)) {
    console.log('✅ SUCCESS: index.html found!');
} else {
    console.log('❌ ERROR: index.html NOT found.');
    console.log('------------------------------------------------');
    console.log('Files in your project folder:');
    fs.readdirSync(__dirname).forEach(file => console.log(` - ${file}`));
    
    if (fs.existsSync(publicDir)) {
        console.log('\nFiles inside "public" folder:');
        fs.readdirSync(publicDir).forEach(file => console.log(` - ${file}`));
    }
>>>>>>> bfc61208343fd448e054cbf3128132d7bf2e693c
}