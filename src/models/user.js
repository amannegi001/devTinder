const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    gender: String,
    age: Number,
    city: String,
    emailID: String,
    password : String,
    phoneNumber: Number
})

const User = mongoose.model('User', userSchema);

module.exports = { User }; 