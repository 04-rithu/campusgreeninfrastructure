require("dotenv").config();
const mongoose = require("mongoose");
const Watering = require("./models/Watering");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusGreenDB";

const runMigration = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected for REVERSE migration...");

    // Find all documents that have duration and don't have waterAmount
    const result = await mongoose.connection.collection('waterings').updateMany(
      { duration: { $exists: true } },
      [
        {
          $set: {
             // Convert duration back to liters (e.g. 50 mins -> 500 liters)
             waterAmount: { $multiply: ["$duration", 10] }
          }
        },
        {
          $unset: ["duration"]
        }
      ]
    );
    
    if (result.modifiedCount === 0) {
        console.log("Pipeline update didn't work, falling back to iterative update...");
        const docs = await mongoose.connection.collection('waterings').find({ duration: { $exists: true } }).toArray();
        let changed = 0;
        for (let doc of docs) {
            const amt = Math.round(doc.duration * 10) || 150;
            await mongoose.connection.collection('waterings').updateOne(
                { _id: doc._id },
                { $set: { waterAmount: amt }, $unset: { duration: "" } }
            );
            changed++;
        }
        console.log(`Migrated ${changed} documents iteratively.`);
    } else {
        console.log(`Migrated ${result.modifiedCount} documents using pipeline.`);
    }

    console.log("Reverse Migration completed!");
    process.exit(0);

  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

runMigration();
