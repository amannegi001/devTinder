const express = require('express');
const { userAuth } = require('../middlewares/auth.js');
const { User } = require('../models/user.js');
const { validateEditProfileData, validateEditPassword } = require('../utils/validation.js');
const bcrypt = require('bcrypt');

const router = express.Router();

router.use(userAuth);

router.get("/profile/view", async (req, res) => {
  try {
    const user = req.user;

    return res.send(user);
  }
  catch (err) {
    return res.status(400).send("ERROR: " + err);
  }
});

router.patch("/profile/edit", async (req, res) => {
  const body = req.body;
  try {
    validateEditProfileData(body);

    const loggedInUser = req.user;

    Object.assign(loggedInUser, body);

    await loggedInUser.save();

    return res.json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully`,
      body: loggedInUser
    });
  }
  catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

router.patch("/profile/password", async (req, res) => {
  const body = req.body;
  const loggedInUser = req.user;

  try {
    await validateEditPassword(body, loggedInUser)

    const { newPassword } = body;

    const newHashPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = newHashPassword;

    await loggedInUser.save();

    return res.json({
      message: "The password has been changed"
    })

  }
  catch (err) {
    return res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = router;