import mongoose from 'mongoose';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const batchSchema = new mongoose.Schema(
  {
    batchCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
      index: true,
    },
    produceType: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: 'kg',
      trim: true,
    },
    arrivalDate: {
      type: Date,
      required: true,
    },
    shelfLifeDays: {
      type: Number,
      required: true,
      min: 0,
    },
    expiryDate: {
      type: Date,
      index: true,
    },
    status: {
      type: String,
      enum: ['stored', 'atRisk', 'expired', 'dispatched'],
      default: 'stored',
      index: true,
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low',
      index: true,
    },
    lastAiAnalyzedAt: {
      type: Date,
    },
    aiCooldownUntil: {
      type: Date,
      index: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
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

batchSchema.index({ batchCode: 1 }, { unique: true });
batchSchema.index({ warehouseId: 1, status: 1 });
batchSchema.index({ warehouseId: 1, riskLevel: 1, riskScore: -1 });
batchSchema.index({ warehouseId: 1, isActive: 1 });

batchSchema.pre('save', function (next) {
  const arrivalChanged = this.isModified('arrivalDate');
  const shelfChanged = this.isModified('shelfLifeDays');

  if ((arrivalChanged || shelfChanged) && this.arrivalDate && this.shelfLifeDays !== undefined) {
    this.expiryDate = new Date(this.arrivalDate.getTime() + this.shelfLifeDays * MS_PER_DAY);
  }

  next();
});

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
