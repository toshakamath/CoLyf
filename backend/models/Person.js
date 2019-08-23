const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    name: String,
    email: String,
    house_id: { type: Schema.Types.ObjectId, ref: 'Home' },
    taskHistory: Object,
}, { timestamps: true });

module.exports = mongoose.model("Person", PersonSchema);
