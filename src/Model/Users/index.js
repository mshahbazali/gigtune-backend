const mongoose = require("mongoose")
const usersSchema = mongoose.model("Users", mongoose.Schema({
    fullName: { type: String },
    emailAddress: { type: String },
    phoneNumber: { type: String },
    password: { type: String },
    address: { type: String },
    profileImage: { type: String },
    Industry: { type: String },
    jobRole: { type: String },
    discription: { type: String },
    events: { type: JSON },
    suggestions: { type: JSON }
}))
exports.usersSchema = usersSchema;