const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: String,
    createdby_id: { type: Schema.Types.ObjectId, ref: 'Person' },
    homeId: { type: Schema.Types.ObjectId, ref: 'Home' },
    rotationType: String,
    start: Date,
    rotationDay: String,
    people: [String],
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
