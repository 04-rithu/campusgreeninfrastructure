require("dotenv").config();
const mongoose = require("mongoose");
const Zone = require("./models/Zone");
const Watering = require("./models/Watering");
const Pesticide = require("./models/Pesticide");
const Trimming = require("./models/Trimming");
const Waste = require("./models/Waste");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusGreenDB";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected for seeding...");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDatabase = async () => {
  try {
    console.log("Starting data seeding...");

    // Clear existing data
    await Zone.deleteMany({});
    await Watering.deleteMany({});
    await Pesticide.deleteMany({});
    await Trimming.deleteMany({});
    await Waste.deleteMany({});
    console.log("Existing data cleared.");

    // Data pools
    const waterSources = ["rainwater", "borewell", "river water", "recycled water"];
    const specificZones = [
      "girls hostel", "boys hostel", "cafteria", "learning centre", 
      "play ground 1", "play ground 2", "IB Block", "AS Block", 
      "SF Block", "MECH", "Reasearch Park", "Agri zone 1", "Agri Zone 2"
    ];
    const pesticideTypes = ["Neem Oil", "Fungicide", "Insecticide", "Herbicide", "Miticides"];
    const quantities = ["1 L", "2 L", "5 L", "10 L", "500 ml", "200 ml", "1 kg", "2 kg"];
    const statuses = ["Scheduled", "Completed", "Pending", "In Progress"];
    const pesticideStatuses = ["Scheduled", "Applied", "Pending"];
    const trimmingTypes = ["Pruning", "Lawn Mowing", "Hedge Trimming", "Weeding", "Tree Felling"];
    const staffNames = ["John Doe", "Jane Smith", "Ramesh Kumar", "Ali Khan", "Maria Garcia", "David Chen", "Amit Patel"];
    const wasteAmounts = ["5 kg", "10 kg", "20 kg", "50 kg", "2 bags", "5 bags", "1 truckload"];
    const wateringTasks = ["Morning Watering", "Evening Watering", "Sprinkler System", "Drip Irrigation", "Deep Soak"];

    const zones = [];
    const waterings = [];
    const pesticides = [];
    const trimmings = [];
    const wastes = [];

    const numRecords = 200;

    // 1. Generate Zones
    for (let zoneName of specificZones) {
      zones.push({
        zoneName: zoneName,
        currentGreenCover: Math.floor(Math.random() * 50) + 30,
        requiredGreenCover: Math.floor(Math.random() * 30) + 60,
        waterSource: getRandomElement(waterSources)
      });
    }

    // Insert zones first to use their exact names (though schema doesn't strictly require it, it's good practice)
    await Zone.insertMany(zones);
    console.log(`${specificZones.length} Zones inserted.`);

    // Fetch inserted zones to get their names
    const insertedZones = await Zone.find();
    const zoneNames = insertedZones.map(z => z.zoneName);

    const now = new Date();
    const pastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    // 2. Generate and Insert Watering
    for (let i = 0; i < numRecords; i++) {
      waterings.push({
        zone: getRandomElement(zoneNames),
        task_description: getRandomElement(wateringTasks),
        duration_minutes: Math.floor(Math.random() * 120) + 15,
        schedule_date: getRandomDate(pastMonth, nextMonth),
        status: getRandomElement(statuses)
      });
    }
    await Watering.insertMany(waterings);
    console.log(`${numRecords} Watering records inserted.`);

    // 3. Generate and Insert Pesticide
    for (let i = 0; i < numRecords; i++) {
        pesticides.push({
        zone: getRandomElement(zoneNames),
        pesticide_type: getRandomElement(pesticideTypes),
        quantity: getRandomElement(quantities),
        schedule_date: getRandomDate(pastMonth, nextMonth),
        status: getRandomElement(pesticideStatuses)
      });
    }
    await Pesticide.insertMany(pesticides);
    console.log(`${numRecords} Pesticide records inserted.`);

    // 4. Generate and Insert Trimming
    for (let i = 0; i < numRecords; i++) {
        trimmings.push({
        zone: getRandomElement(zoneNames),
        trimming_type: getRandomElement(trimmingTypes),
        staff_assigned: getRandomElement(staffNames),
        schedule_date: getRandomDate(pastMonth, nextMonth),
        status: getRandomElement(statuses)
      });
    }
    await Trimming.insertMany(trimmings);
    console.log(`${numRecords} Trimming records inserted.`);

    // 5. Generate and Insert Waste
    for (let i = 0; i < numRecords; i++) {
        wastes.push({
        zone: getRandomElement(zoneNames),
        waste_amount: getRandomElement(wasteAmounts),
        collection_date: getRandomDate(pastMonth, nextMonth),
        status: getRandomElement(statuses)
      });
    }
    await Waste.insertMany(wastes);
    console.log(`${numRecords} Waste records inserted.`);

    console.log("Seeding completed successfully!");
    process.exit(0);

  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
};

connectDB().then(seedDatabase);
