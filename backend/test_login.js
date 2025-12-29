const axios = require('axios');

async function testLogin() {
    try {
        console.log('Attempting login...');
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'PPC001',
            password: 'user123'
        });
        console.log('Login Successful:', res.data);
    } catch (error) {
        console.error('Login Failed:', error.response ? error.response.data : error.message);
    }
}

testLogin();
