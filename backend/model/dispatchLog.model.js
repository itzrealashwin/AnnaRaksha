import mongoose from 'mongoose';

const dispatchLogSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
      index: true,
    },
    quantityDispatched: {
      type: Number,
      required: true,
      min: 0,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

dispatchLogSchema.index({ batchId: 1, createdAt: -1 });
dispatchLogSchema.index({ performedBy: 1, createdAt: -1 });

dispatchLogSchema.pre('save', function (next) {
  if (this.quantityDispatched < 0) {
    this.quantityDispatched = 0;
  }
  next();
});

const DispatchLog = mongoose.model('DispatchLog', dispatchLogSchema);

export default DispatchLog;
