const mongoose = require("mongoose")
const eventsSchema = mongoose.model("Events", mongoose.Schema({
    title: { type: String },
    date: { type: String },
    location: { type: String },
    discription: { type: String },
    photos: { type: Array },
    files: { type: Array },
    team: { type: Array },
    admin: { type: String },
    createdAt: { type: String }
}))
exports.eventsSchema = eventsSchema;