import mongoose from 'mongoose';

const aiForecastSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['batch', 'warehouse'],
      required: true,
      index: true,
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
      index: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      default: null,
      index: true,
    },
    forecastSummary: {
      type: String,
      required: true,
      trim: true,
    },
    predictedRiskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      index: true,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
    },
  },
  {
    timestamps: true,
  }
);

aioForecastSchema.index({ type: 1, warehouseId: 1, batchId: 1 });
aioForecastSchema.index({ createdAt: -1 });

aioForecastSchema.pre('save', function (next) {
  if (this.type === 'warehouse') {
    this.batchId = null;
  }
  next();
});

const AiForecast = mongoose.model('AiForecast', aiForecastSchema);

export default AiForecast;
