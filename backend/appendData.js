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
    console.log("MongoDB Connected for appending...");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const appendDatabase = async () => {
  try {
    console.log("Starting data appending...");

    // Data pools
    const pesticideTypes = ["Neem Oil", "Fungicide", "Insecticide", "Herbicide", "Miticides"];
    const quantities = ["1 L", "2 L", "5 L", "10 L", "500 ml", "200 ml", "1 kg", "2 kg"];
    const statuses = ["Scheduled", "Completed", "Pending", "In Progress"];
    const pesticideStatuses = ["Scheduled", "Applied", "Pending"];
    const trimmingTypes = ["Pruning", "Lawn Mowing", "Hedge Trimming", "Weeding", "Tree Felling"];
    const staffNames = ["John Doe", "Jane Smith", "Ramesh Kumar", "Ali Khan", "Maria Garcia", "David Chen", "Amit Patel"];
    const wasteAmounts = ["5 kg", "10 kg", "20 kg", "50 kg", "2 bags", "5 bags", "1 truckload"];
    const wateringTasks = ["Morning Watering", "Evening Watering", "Sprinkler System", "Drip Irrigation", "Deep Soak"];

    const waterings = [];
    const pesticides = [];
    const trimmings = [];
    const wastes = [];

    const numRecords = 100;

    // Fetch inserted zones to get their names
    const insertedZones = await Zone.find();
    if (insertedZones.length === 0) {
        console.log("No zones found! Please run seed.js first.");
        process.exit(1);
    }
    const zoneNames = insertedZones.map(z => z.zoneName);

    const now = new Date();
    const pastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    // 1. Generate and Insert Watering
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
    console.log(`${numRecords} additional Watering records inserted.`);

    // 2. Generate and Insert Pesticide
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
    console.log(`${numRecords} additional Pesticide records inserted.`);

    // 3. Generate and Insert Trimming
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
    console.log(`${numRecords} additional Trimming records inserted.`);

    // 4. Generate and Insert Waste
    for (let i = 0; i < numRecords; i++) {
        wastes.push({
        zone: getRandomElement(zoneNames),
        waste_amount: getRandomElement(wasteAmounts),
        collection_date: getRandomDate(pastMonth, nextMonth),
        status: getRandomElement(statuses)
      });
    }
    await Waste.insertMany(wastes);
    console.log(`${numRecords} additional Waste records inserted.`);

    console.log("Appending completed successfully!");
    process.exit(0);

  } catch (err) {
    console.error("Error during appending:", err);
    process.exit(1);
  }
};

connectDB().then(appendDatabase);
