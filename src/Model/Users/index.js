const mongoose = require("mongoose")
const usersSchema = mongoose.model("Users", mongoose.Schema({
    fullName: { type: String },
    emailAddress: { type: String },
    phoneNumber: { type: String },
    password: { type: String },
    address: { type: String },
    profileImage: { type: String },
    businessName: { type: String },
    jobRole: { type: Array },
    discription: { type: String },
    suggestions: { type: Array },
    notificationToken: { type: String },
}))
exports.usersSchema = usersSchema;