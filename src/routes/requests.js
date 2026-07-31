const express = require('express');
const { userAuth } = require('../middlewares/auth.js')

const router = express.Router();

router.post("/sendConnectionRequest", userAuth, async (req, res) => {

    console.log(req.user.firstName, "is sending connection request");

    res.send(req.user.firstName + " is sending connection request");
})

module.exports = router;