const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskAssignmentSchema = new Schema({
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    personId: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    taskName: String,
    personName: String,
    rotationType: String,
    done: { type: Boolean, default: false },
    deadline: Date,
    homeId: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
    delted: Boolean
}, { timestamps: true });

module.exports = mongoose.model("TaskAssignment", TaskAssignmentSchema);
