require('dotenv').config();
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const Suggestion = require('./models/Suggestion');
const User = require('./models/User');

const seedData = async () => {
    try {
        await connectDB();
        
        // Get users and default to regular users if any
        let users = await User.find({ role: { $ne: 'admin' } });
        if (users.length === 0) {
            console.log("No non-admin users found. Fetching any users...");
            users = await User.find({});
        }

        if (users.length === 0) {
             console.error("No users found at all! Please register a user first.");
             process.exit(1);
        }

        const zones = ["North Gate", "Main Garden", "Academic Block", "Hostel Avenue", "Sports Field", "Library Lawn", "Parking Lot", "Cafeteria Outdoor", "Science Park", "OAT"];
        const suggestionTypes = ["Maintenance Issue", "New Planting", "Infrastructure Improvement", "Other"];
        const statuses = ["Pending", "Assigned", "Resolved"];

        const suggestionsToInsert = [];

        // Generate 500 dummy suggestions
        for (let i = 1; i <= 500; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomZone = zones[Math.floor(Math.random() * zones.length)];
            const randomType = suggestionTypes[Math.floor(Math.random() * suggestionTypes.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            // Random date within the last 6 months
            const dateStr = Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 180);
            
            let adminResponse = "";
            if (randomStatus === "Resolved") {
                 adminResponse = "Thank you for the suggestion. This has been addressed by the maintenance team.";
            } else if (randomStatus === "Assigned") {
                 adminResponse = "We have assigned this to the relevant department and it is under review.";
            }

            suggestionsToInsert.push({
                user_id: randomUser._id,
                user_name: randomUser.name,
                zone: randomZone,
                suggestion_type: randomType,
                description: `This is a generated dummy suggestion #${i} regarding a ${randomType.toLowerCase()} in the ${randomZone}. Please look into this at the earliest convenience.`,
                status: randomStatus,
                admin_response: adminResponse,
                date_submitted: new Date(dateStr)
            });
        }

        console.log(`Inserting ${suggestionsToInsert.length} suggestions...`);
        await Suggestion.insertMany(suggestionsToInsert);
        
        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedData();
