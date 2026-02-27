import cron from "node-cron";
import Warehouse from "../model/warehouse.model.js";
import SensorReading from "../model/sensorReading.model.js";

const generateSensorData = (type) => {
  let temperature;
  let humidity;

  switch (type) {
    case "cold":
      temperature = +(Math.random() * 8 + 2).toFixed(2);
      humidity = +(Math.random() * 20 + 60).toFixed(2);
      break;

    case "dry":
      temperature = +(Math.random() * 10 + 20).toFixed(2);
      humidity = +(Math.random() * 20 + 30).toFixed(2);
      break;

    default:
      temperature = +(Math.random() * 15 + 15).toFixed(2);
      humidity = +(Math.random() * 30 + 40).toFixed(2);
  }

  return { temperature, humidity };
};

// Every 5 minutes
export const startSensorCronJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running sensor simulation...");

    const warehouses = await Warehouse.find({ isActive: true });

    for (const warehouse of warehouses) {
      const { temperature, humidity } = generateSensorData(
        warehouse.warehouseType
      );

      await SensorReading.create({
        warehouseId: warehouse._id,
        temperature,
        humidity,
        source: "simulator",
        recordedAt: new Date(),
      });
    }

    console.log("Sensor data inserted");
  });
};