const mongoose = require('mongoose');
const validator = require('validator')

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 20,
    },
    gender: {
        type: String,
        validate(value) {
            value = value.toLowerCase();
            if (!['female', 'male', 'others'].includes(value)) {
                throw new Error("Invalid gender!");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    city: String,
    emailId: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email: " + value);
            }
        },
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        immutable: true
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: Number,
    about: {
        type: String,
        default: "Hey there, let's be friends."
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL: " + value);
            }
        },
        default: "https://www.pngall.com/profile-png/download/51543/"
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = { User }; 