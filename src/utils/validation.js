const validator = require('validator');
const bcrypt = require('bcrypt');
const { User } = require('../models/user.js');
const { ConnectionRequest } = require('../models/connectionRequest.js');

async function validateSignUpData(body) {
    const { firstName, emailId, password } = body;
    if (!firstName) {
        throw new Error("First name is required.");
    }
    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email.");
    }
    if (!password) {
        throw new Error("Password is required.");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Weak password.");
    }
    const isUserExists = await User.findOne({emailId});

    if(isUserExists) {
        throw new Error("User already exists");
    }
}

function validateloginData(body) {
    const { emailId, password } = body;
    if (!emailId) {
        throw new Error("EmaiId is required.");
    }
    if (!password) {
        throw new Error("Password is required.");
    }
    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email.");
    }
}

function validateEditProfileData(body) {
    const allowedFields = [
        "firstName",
        "lastName",
        "about",
        "photoUrl",
        "gender",
        "age",
        "skills",
    ];

    const invalidField = Object.keys(body).find(
        field => !allowedFields.includes(field)
    );

    if (invalidField) {
        throw new Error(`Invalid edit request: '${invalidField}'`);
    }
}

async function validateEditPassword(body, user) {
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
        throw new Error("Current password and new password are required");
    }

    const isMatch = await user.validatePassword(currentPassword);

    if (!isMatch) {
        throw new Error("Current password is incorrect");
    }

    const isSamePassword = await user.validatePassword(newPassword);

    if (isSamePassword) {
        throw new Error("New password must be different from current password");
    }

    if (!validator.isStrongPassword(newPassword)) {
        throw new Error("New password is weak");
    }

}

async function validateConnectionRequestInfo(status, receiverId, senderId) {
    const allowedStatuses = ["interested", "ignored"];

    const receiver = await User.findById(receiverId);    

    if(!receiver){
        throw new Error("Receiver not found");
    }
    
    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid status type: " + status);
    }

    const isConnectionRequestExist = await ConnectionRequest.findOne({
        $or: [
            { receiverId, senderId },
            { receiverId: senderId, senderId: receiverId }
        ]
    })

    if (isConnectionRequestExist) {
        throw new Error("Connection request already exists");
    }
    return receiver;
}

module.exports = { validateSignUpData, validateloginData, validateEditProfileData, validateEditPassword, validateConnectionRequestInfo }