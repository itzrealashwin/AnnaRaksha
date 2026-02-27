import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    location: {
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: String, trim: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    capacity: {
      type: Number,
      required: true,
      min: 0,
    },
    currentUtilization: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
      index: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

warehouseSchema.index({ code: 1 }, { unique: true });
warehouseSchema.index({ status: 1, isActive: 1 });
warehouseSchema.index({ createdBy: 1, isActive: 1 });

warehouseSchema.virtual('utilizationPercent').get(function () {
  if (!this.capacity) return 0;
  return Math.min(100, (this.currentUtilization / this.capacity) * 100);
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

export default Warehouse;
