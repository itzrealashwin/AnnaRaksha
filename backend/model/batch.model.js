import mongoose from "mongoose";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const batchSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
      index: true,
    },
    produceType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    quantityInitial: { type: Number, required: true, min: 1 },
    quantityCurrent: { type: Number, required: true, min: 0 },
    unit: {
      type: String,
      default: "kg",
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
    daysStored: { type: Number },
    status: {
      type: String,
      enum: [
        "Fresh",
        "Maturing",
        "NearExpiry",
        "Expired",
        "Dispatched",
        "Disposed",
      ],
      default: "Fresh",
      index: true,
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true,
    },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
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
    lastRiskUpdatedAt: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

batchSchema.index({ warehouseId: 1, status: 1 });
batchSchema.index({ warehouseId: 1, riskLevel: 1, riskScore: -1 });
batchSchema.index({ warehouseId: 1, isActive: 1 });

batchSchema.pre("save", function (next) {
  const arrivalChanged = this.isModified("arrivalDate");
  const shelfChanged = this.isModified("shelfLifeDays");

  if (
    (arrivalChanged || shelfChanged) &&  this.arrivalDate &&   this.shelfLifeDays !== undefined  ) {
    this.expiryDate = new Date( this.arrivalDate.getTime() + this.shelfLifeDays * MS_PER_DAY );
    const now = new Date();
    this.daysStored = Math.floor((now - this.arrivalDate) / (1000 * 60 * 60 * 24));
  }

  next();
});

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
