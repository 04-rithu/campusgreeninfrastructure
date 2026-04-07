require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

(async () => {
    try {
        await connectDB();
        const user = await User.findOne({ email: 'rithupavisha.ct23@bitsathy.ac.in' });
        const admin = await User.findOne({ email: 'admin@campus.edu' });

        if (!user || !admin) {
            console.error('Users not found');
            process.exit(1);
        }

        const userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        console.log('Testing User Suggestion POST...');
        const postRes = await fetch('http://localhost:5000/api/suggestions', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                zone: 'Main Garden',
                suggestion_type: 'Other',
                description: 'Test suggestion from script'
            })
        });
        const postData = await postRes.json();
        console.log('POST Status:', postRes.status);
        if (postRes.status !== 201) throw new Error(JSON.stringify(postData));

        const suggestionId = postData.suggestion._id;
        console.log('Created Suggestion ID:', suggestionId);

        console.log('Testing Admin Update Status...');
        const putRes = await fetch(`http://localhost:5000/api/suggestions/${suggestionId}/status`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ status: 'Resolved' })
        });
        const putData = await putRes.json();
        console.log('PUT Status Response:', putData.message);

        process.exit(0);
    } catch (err) {
        console.error('Test Failed:', err);
        process.exit(1);
    }
})();
