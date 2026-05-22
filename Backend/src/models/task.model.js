import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    task: { type: String, required: true },
    description: { type: String, default: "" },
    deadline: { type: Date },
    dueTime: { type: String, default: null }, // "HH:MM" or null
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    googleCalendarEventId: { type: String, default: null },
    sourceText: { type: String },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
