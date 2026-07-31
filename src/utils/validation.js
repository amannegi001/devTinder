const validator = require('validator');
const bcrypt = require('bcrypt');

function validateSignUpData(body) {
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

    if(isSamePassword){
        throw new Error("New password must be different from current password");
    }
    
    if (!validator.isStrongPassword(newPassword)) {
        throw new Error("New password is weak");
    }

}

module.exports = { validateSignUpData, validateloginData, validateEditProfileData, validateEditPassword }