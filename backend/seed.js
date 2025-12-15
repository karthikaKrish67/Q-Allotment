const axios = require('axios');

async function seed() {
    try {
        await axios.post('http://localhost:5000/api/auth/register', {
            username: 'admin',
            password: 'password123',
            role: 'admin'
        });
        console.log('Admin user seeded successfully');
    } catch (error) {
        if (error.response && error.response.status === 500 && error.response.data.details.includes('Validation error')) {
            console.log('Admin user already exists');
        } else {
            console.error('Failed to seed admin:', error.message);
        }
    }
}

seed();
