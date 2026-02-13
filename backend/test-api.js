const API_URL = 'http://localhost:5000/api/watering';

async function testWateringCRUD() {
    const token = await login();
    if (!token) return;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    try {
        // 1. Create
        console.log('Creating entry...');
        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                zoneName: 'Test Zone',
                task: 'Test Task',
                waterAmount: '100',
                scheduleDate: new Date().toISOString()
            })
        });
        const created = await createRes.json();
        console.log('Created:', created._id);

        // 2. Update
        console.log('Updating entry...');
        const updateRes = await fetch(`${API_URL}/${created._id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                zoneName: 'Test Zone',
                task: 'Updated Task',
                waterAmount: '150',
                scheduleDate: new Date().toISOString()
            })
        });
        const updated = await updateRes.json();
        console.log('Updated:', updated.task === 'Updated Task');

        // 3. Delete
        console.log('Deleting entry...');
        const deleteRes = await fetch(`${API_URL}/${created._id}`, {
            method: 'DELETE',
            headers
        });
        const deleted = await deleteRes.json();
        console.log('Deleted:', deleteRes.ok);

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

async function login() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test1770884756891@example.com', password: 'password123' }) // Using user from previous test
        });
        const data = await res.json();
        return data.token;
    } catch (e) {
        console.error('Login failed:', e);
        return null;
    }
}

testWateringCRUD();
