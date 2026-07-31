const express = require('express');
const { User } = require('../models/user.js')
const { validateSignUpData, validateloginData } = require('../utils/validation.js');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post("/signup", async (req, res) => {

    const data = req.body;

    const { firstName, lastName, emailId, password } = data;

    try {
        // Validation
        validateSignUpData(data);

        // Encryption
        const hashPassword = await bcrypt.hash(password, 10);

        // Crating an instance of the User model
        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword
        })

        await newUser.save();
        return res.send("The user created successfully.")
    }
    catch (err) {
        return res.status(400).send("ERROR: " + err.message);
    }

});

router.post("/login", async (req, res) => {
    const data = req.body;

    const { emailId, password } = data;

    try {

        validateloginData(data);
        const user = await User.findOne({ emailId }).exec();
        if (!user) {
            throw new Error("Invalid credentials")
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            });
            return res.send("Logged in successfully.");
        }
        else {
            throw new Error("Invalid credentials");
        }
    }
    catch (err) {
        return res.status(400).send("ERROR: " + err.message);
    }
});

router.post("/logout", async (req, res) => {
    try {
        res.clearCookie("token");
        res.cookie("token", null ,{
            expires: new Date(Date.now())
        });
        return res.send("Logged out");
    }
    catch (err) {
        return res.status(400).send("ERROR: " + err);
    }
});

module.exports = router;