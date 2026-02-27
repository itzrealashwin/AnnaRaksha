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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

batchSchema.index({ warehouseId: 1, status: 1 });
batchSchema.index({ warehouseId: 1, riskLevel: 1, riskScore: -1 });
batchSchema.index({ warehouseId: 1, isActive: 1 });
batchSchema.index({ expiryDate: 1 }); // new – near expiry queries ke liye

// batchSchema.pre("save", function () {
//   const arrivalChanged = this.isModified("arrivalDate");
//   const shelfChanged = this.isModified("shelfLifeDays");

//   if (
//     (arrivalChanged || shelfChanged) &&  this.arrivalDate &&   this.shelfLifeDays !== undefined  ) {
//     this.expiryDate = new Date( this.arrivalDate.getTime() + this.shelfLifeDays * MS_PER_DAY );
//     const now = new Date();
//     this.daysStored = Math.floor((now - this.arrivalDate) / (1000 * 60 * 60 * 24));
//   }

// });

// Pre-save hook – har save pe calculate karo (create + update dono pe)
batchSchema.pre("save", function (next) {
  const now = new Date();

  // Expiry aur daysStored har baar recalc karo (safety ke liye)
  if (this.arrivalDate && this.shelfLifeDays !== undefined) {
    this.expiryDate = new Date(
      this.arrivalDate.getTime() + this.shelfLifeDays * MS_PER_DAY,
    );
    this.daysStored = Math.floor((now - this.arrivalDate) / MS_PER_DAY);
  }

  // Auto status update based on expiry
  if (
    this.expiryDate &&
    now > this.expiryDate &&
    this.status !== "Dispatched" &&
    this.status !== "Disposed"
  ) {
    this.status = "Expired";
  }

  // Agar riskScore change hua ya naya batch hai → lastRiskUpdatedAt set karo
  if (this.isModified("riskScore") || this.isNew) {
    this.lastRiskUpdatedAt = now;
  }
});

// Virtual: Days left to expiry (dashboard ke liye bohot useful)
batchSchema.virtual("daysToExpiry").get(function () {
  if (!this.expiryDate) return null;
  const now = new Date();
  return Math.max(0, Math.floor((this.expiryDate - now) / MS_PER_DAY));
});

// Helper method: Risk Score + Level recalculate (call kar sakte ho jab chaho)
batchSchema.methods.recalculateRisk = async function (latestSensor = null) {
  let score = 0;

  // 1. Time-based risk (expiry proximity)
  const daysLeft = this.daysToExpiry || 0;
  if (daysLeft <= 0) {
    score += 100;
  } else if (daysLeft <= 7) {
    score += 70 + (7 - daysLeft) * 4; // last week mein fast increase
  } else if (daysLeft <= 30) {
    score += 30 + (30 - daysLeft) * 1.33;
  } else if (daysLeft <= this.shelfLifeDays * 0.3) {
    score += 15; // last 30% shelf life mein thoda risk
  }

  // 2. Environment deviation (agar sensor data diya)
  if (latestSensor && this.warehouseId) {
    // Assume warehouse optimal ranges future mein add honge
    const optimalTemp = 4; // temporary hardcode – baad mein warehouse se le
    const optimalHum = 70;

    const tempDev = Math.abs(latestSensor.temperature - optimalTemp);
    const humDev = Math.abs(latestSensor.humidity - optimalHum);

    score += tempDev * 5 + humDev * 1.2;

    // Penalty for extreme deviation
    if (tempDev > 5 || humDev > 25) score += 25;
  }

  // Cap at 100
  this.riskScore = Math.min(100, Math.round(score));

  // Auto set riskLevel
  if (this.riskScore >= 85) this.riskLevel = "Critical";
  else if (this.riskScore >= 60) this.riskLevel = "High";
  else if (this.riskScore >= 30) this.riskLevel = "Medium";
  else this.riskLevel = "Low";

  // Update timestamp
  this.lastRiskUpdatedAt = new Date();

  await this.save();
};

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
