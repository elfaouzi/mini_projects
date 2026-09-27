const mongoose = require('mongoose');

const STATUS = ['todo', 'in-progress', 'done'];

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: STATUS,
        message: 'Status must be one of: To Do, In Progress, Done',
      },
      default: 'To Do',
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

TaskSchema.statics.STATUS = STATUS;

module.exports = mongoose.model('Task', TaskSchema);
