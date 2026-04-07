require("dotenv").config();
const mongoose = require("mongoose");
const Zone = require("./models/Zone");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusGreenDB";

const swapGreenCover = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected for swapping...");

    const playground1 = await Zone.findOne({ zoneName: "play ground 1" });
    const ibBlock = await Zone.findOne({ zoneName: "IB Block" });

    if (!playground1 || !ibBlock) {
        console.log("Could not find one or both zones.");
        process.exit(1);
    }

    console.log(`Before swap: play ground 1 = ${playground1.greenCover}, IB Block = ${ibBlock.greenCover}`);

    const tempCover = playground1.greenCover;
    playground1.greenCover = ibBlock.greenCover;
    ibBlock.greenCover = tempCover;

    await playground1.save();
    await ibBlock.save();

    console.log(`After swap: play ground 1 = ${playground1.greenCover}, IB Block = ${ibBlock.greenCover}`);
    console.log("Swap completed successfully!");
    process.exit(0);

  } catch (err) {
    console.error("Error during swapping:", err);
    process.exit(1);
  }
};

swapGreenCover();
