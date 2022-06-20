const mongoose = require("mongoose")
const usersSchema = mongoose.model("Users", mongoose.Schema({
    fullName: { type: String },
    emaillAddress: { type: String },
    phoneNumber: { type: String },
    password: { type: String },
    address: { type: String },
    profileImage: { type: String },
    Industry: { type: String },
    jobRole: { type: String },
    discription: { type: String },
    events: { type: Array }
}))
exports.usersSchema = usersSchema;