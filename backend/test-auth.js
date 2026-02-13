const API_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
    const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
    };

    try {
        // 1. Register
        console.log('Registering user:', testUser.email);
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();
        console.log('Registration Status:', regRes.status);
        console.log('Registration Response:', regData);

        if (!regRes.ok) throw new Error('Registration failed');

        // 2. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        console.log('Login Response:', loginData);

    } catch (error) {
        console.error('Auth Test Failed:', error.message);
    }
}

testAuth();
