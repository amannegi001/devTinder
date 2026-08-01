const express = require('express');
const { userAuth } = require('../middlewares/auth.js')
const { ConnectionRequest } = require('../models/connectionRequest.js');
const { validateConnectionRequestInfo } = require('../utils/validation.js')

const router = express.Router();

router.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    const status = req.params.status;
    const receiverId = req.params.userId;
    const senderId = req.user._id;
    const sender = req.user;

    try {
        const receiver = await validateConnectionRequestInfo(status, receiverId, senderId);

        const connectionRequest = new ConnectionRequest({
            senderId,
            receiverId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message:
                status === "interested"
                    ? `${sender.firstName} is interested in ${receiver.firstName}`
                    : `${sender.firstName} ignored ${receiver.firstName}`
        });
    }
    catch (err) {
        res.status(400).json({
            message: "ERROR",
            Error: err.message
        })
    }
})

module.exports = router;