require("dotenv").config();
const mongoose = require("mongoose");
const Watering = require("./models/Watering");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusGreenDB";

const runMigration = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected for migration...");

    // Find all documents that have waterAmount and don't have duration
    // Actually, schema is strict. We need to bypass strict mode or just use native driver update
    const result = await mongoose.connection.collection('waterings').updateMany(
      { waterAmount: { $exists: true } },
      [
        {
          $set: {
             // Convert amount in liters to minutes (e.g. 500 liters -> 50 mins)
             duration: { $round: [{ $divide: ["$waterAmount", 10] }] }
          }
        },
        {
          $unset: ["waterAmount"]
        } // Unset in second stage pipeline doesn't always work neatly, simpler to use standard update
      ]
    );
    
    // Simpler fallback if aggregation pipeline update fails due to mongoose version
    if (result.modifiedCount === 0) {
        console.log("Pipeline update didn't work, falling back to iterative update...");
        const docs = await mongoose.connection.collection('waterings').find({ waterAmount: { $exists: true } }).toArray();
        let changed = 0;
        for (let doc of docs) {
            const time = Math.round(doc.waterAmount / 10) || 15;
            await mongoose.connection.collection('waterings').updateOne(
                { _id: doc._id },
                { $set: { duration: time }, $unset: { waterAmount: "" } }
            );
            changed++;
        }
        console.log(`Migrated ${changed} documents iteratively.`);
    } else {
        console.log(`Migrated ${result.modifiedCount} documents using pipeline.`);
    }

    console.log("Migration completed!");
    process.exit(0);

  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

runMigration();
