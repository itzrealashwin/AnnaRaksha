import mongoose from 'mongoose';

const sensorReadingSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
      index: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      default: 'simulator',
      trim: true,
    },
    recordedAt: { type: Date, default: Date.now, index: true }
  },
  {
    timestamps: true,
  }
);

sensorReadingSchema.index({ warehouseId: 1, createdAt: -1 });
sensorReadingSchema.index({ createdAt: -1 });

const SensorReading = mongoose.model('SensorReading', sensorReadingSchema);

export default SensorReading;
