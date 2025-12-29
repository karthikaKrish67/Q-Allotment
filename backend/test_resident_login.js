const axios = require('axios');

async function testKarthyLogin() {
    try {
        console.log('Testing Resident Login (Karthy) with 9632547812...');
        const res = await axios.post('http://localhost:5000/api/auth/login-phone', {
            phoneNumber: '9632547812',
            otp: '1234'
        });
        console.log('Login Success:', res.data);
    } catch (error) {
        console.error('Login Failed:', error.response ? error.response.data : error.message);
    }
}

testKarthyLogin();
