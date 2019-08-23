const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HomeSchema = new Schema({
    name: String,
    account_name: String,
    passcode: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'Person' }
}, { timestamps: true });

module.exports = mongoose.model("Home", HomeSchema);
