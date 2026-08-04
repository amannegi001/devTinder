const express = require('express');
const { User } = require('../models/user.js');
const { ConnectionRequest } = require('../models/connectionRequest.js');
const { userAuth } = require('../middlewares/auth.js');
const { set, Collection } = require('mongoose');

const router = express.Router();

router.use(userAuth);

router.get("/user/connections", async (req, res) => {
    const userId = req.user._id;
    const USER_SAFE_DATA = "firstName lastName age gender about photoUrl skills";

    try {
        const connections = await ConnectionRequest.find({
            status: "accepted",
            $or: [
                { receiverId: userId },
                { senderId: userId }
            ]
        }).populate("senderId", USER_SAFE_DATA).populate("receiverId", USER_SAFE_DATA);

        const totalConnections = connections.length;

        const data = connections.map(row => {
            if (row.senderId._id.equals(userId)) return row.receiverId;
            else return row.senderId;
        });

        if (totalConnections === 0) {
            return res.json({
                message: "You have 0 connections"
            })
        }

        res.json({
            message: "You have " + totalConnections + " connections",
            connections: data
        })
    }
    catch (err) {
        res.status(400).json({
            message: "ERROR",
            Error: err.message
        })
    }



})

router.get("/user/requests/received", async (req, res) => {
    const userId = req.user;

    try {
        const requests = await ConnectionRequest.find({
            receiverId: userId,
            status: "interested"
        }).populate("senderId", "firstName lastName age photoUrl gender about skills");

        if (requests.length === 0) {
            return res.json({
                message: "You have no requests."
            });
        }

        res.json({
            message: "All requests retirieved successfully",
            requests
        })
    }
    catch (err) {
        res.status(400).json({
            message: "ERROR",
            Error: err.message
        })
    }


})

router.get("/user/feed", async (req, res) => {
    const loggedInUser = req.user;

    const USER_SAFE_DATA = "firstName lastName age gender about photoUrl skills";

    const loggedInUserId = loggedInUser._id;
    try {

        const existingConnections = await ConnectionRequest.find({
            $or: [
                { receiverId: loggedInUserId },
                { senderId: loggedInUserId }
            ]
        }).select('receiverId senderId').lean();

        const relatedUserIds = new Set();

        existingConnections.forEach(connection => {
            if (connection.senderId.equals(loggedInUserId)) {
                relatedUserIds.add(connection.receiverId);
            }
            else {
                relatedUserIds.add(connection.senderId);
            }
        })

        const feed = await User.find({
            _id: {
                $nin: [...relatedUserIds, loggedInUserId]
            }
        }).select(USER_SAFE_DATA).lean();

        res.json({
            message: "Below are the profiles of all the users ",
            Users: feed
        })
    }
    catch (err) {
        res.status(400).json({
            message: "ERROR",
            err: err.message
        })
    }
})

module.exports = router;