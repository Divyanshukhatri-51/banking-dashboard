import mongoose from "mongoose";
import { RECORD_TYPES, RECORD_CATEGORIES } from "../utils/constants.js";

const recordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      enum: Object.values(RECORD_TYPES),
      required: [true, "Type is required (income or expense)"],
    },
    category: {
      type: String,
      enum: RECORD_CATEGORIES,
      required: [true, "Category is required"],
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for common queries
recordSchema.index({ createdBy: 1, date: -1 });
recordSchema.index({ type: 1, category: 1 });
recordSchema.index({ date: -1 });

// Exclude soft-deleted records from queries by default
recordSchema.pre(/^find/, function () {
  const filter = this.getFilter();
  if (filter.isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
});

export default mongoose.model("Record", recordSchema);
