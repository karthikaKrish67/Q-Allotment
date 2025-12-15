const axios = require('axios');

async function testLogin() {
    try {
        console.log('Attempting login with admin/password123...');
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'admin',
            password: 'password123'
        });
        console.log('Login successful:', res.data);
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        console.error('Status:', error.response ? error.response.status : 'Unknown');
    }
}

testLogin();
