import mongoose from 'mongoose';

const aiAlertSchema = new mongoose.Schema(
  {
    alertType: {
      type: String,
      enum: ['spoilage', 'nearExpiry', 'highDuration', 'forecastWarning'],
      required: true,
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
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
      index: true,
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    recommendedAction: {
      type: String,
      required: true,
      trim: true,
    },
    timeToCriticalHours: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'dismissed'],
      default: 'active',
      index: true,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

aioAlertSchema.index({ warehouseId: 1, status: 1, riskLevel: 1 });
aioAlertSchema.index({ batchId: 1, status: 1 });
aioAlertSchema.index({ createdAt: -1 });

const AiAlert = mongoose.model('AiAlert', aiAlertSchema);

export default AiAlert;
