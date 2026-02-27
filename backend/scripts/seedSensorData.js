import mongoose from "mongoose";
import dotenv from "dotenv";
import Warehouse from "../model/warehouse.model.js";
import SensorReading from "../model/sensorReading.model.js";
import User from "../model/user.model.js";
dotenv.config();

const MONGO_URI = process.env.MONGO_SRV;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    // ----------------------------
    // 1️⃣ Find existing user (createdBy)
    // ----------------------------
    const user = await User.findOne({ email: "patiljayesh1469@gmail.com" });

    if (!user) {
      throw new Error("User not found. Please create user first.");
    }

    // ----------------------------
    // 2️⃣ Create Single Warehouse
    // ----------------------------
    const warehouse = await Warehouse.create({
      name: "Pune Central Warehouse",
      code: "PUNE001",
      warehouseType: "cold",
      location: {
        address: "Hinjewadi Phase 1",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        pincode: "411057",
        coordinates: {
          lat: 18.5912,
          lng: 73.7389,
        },
      },
      capacity: 1000,
      currentUtilization: 450,
      status: "active",
      createdBy: user._id,
    });

    console.log("✅ Warehouse Created:", warehouse._id);

    // ----------------------------
    // 3️⃣ Generate 50 Sensor Readings
    // ----------------------------
    const readings = [];

    for (let i = 0; i < 50; i++) {
      readings.push({
        warehouseId: warehouse._id,
        temperature: randomBetween(2, 8), // cold storage temp
        humidity: randomBetween(60, 90),
        source: "simulator",
        createdAt: new Date(Date.now() - i * 5 * 60 * 1000), // 5 min interval
        updatedAt: new Date(Date.now() - i * 5 * 60 * 1000),
      });
    }

    await SensorReading.insertMany(readings);

    console.log("✅ 50 Sensor Readings Created");

    console.log("🎉 Seeding Completed Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

function randomBetween(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

seed();
