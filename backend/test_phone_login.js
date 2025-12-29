const axios = require('axios');

async function testPhoneLogin() {
    try {
        console.log('Testing Phone Login with 9876543210...');
        const res = await axios.post('http://localhost:5000/api/auth/login-phone', {
            phoneNumber: '9876543210',
            otp: '1234'
        });
        console.log('Login Success:', res.data);
    } catch (error) {
        console.error('Login Failed:', error.response ? error.response.data : error.message);
    }
}

testPhoneLogin();
