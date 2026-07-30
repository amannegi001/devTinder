const validator = require('validator');

function validateSignUpData(data) {
    const { firstName, emailId, password } = data;
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

function validateloginData(data) {
    const { emailId, password } = data;
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

module.exports = { validateSignUpData, validateloginData }