const jwt = require('jsonwebtoken');
const { User } = require("../models/user.js");

async function userAuth(req, res, next) {

    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Invalid token");
        }

        const decodedMsg = await jwt.verify(token, '#1Kr$naLeg@cY');

        const { _id } = decodedMsg;

        const user = await User.findById(_id).exec();

        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;

        next();
    }
    catch (err) {
        return res.status(404).send("ERROR: " + err.message);
    }

}

module.exports = { userAuth }