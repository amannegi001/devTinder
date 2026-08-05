const mongoose = require('mongoose');

const { Schema } = mongoose;

const connectionRequestSchema = new Schema({
    receiverId: {
        ref : "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    senderId: {
        ref : "User", //Reference to the user collection
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["accepted", "rejected", "interested", "ignored"],
            message: "{VALUE} is incorrect status type"
        }
    }

}, { timestamps: true });

connectionRequestSchema.index({receiverId : 1, senderId : 1});

connectionRequestSchema.pre("save", function () {
    if (this.receiverId.equals(this.senderId)) {
        throw new Error("Cannot send the request to yourself");
    }
})

const ConnectionRequest = new mongoose.model("connectionRequestSchema", connectionRequestSchema);

module.exports = { ConnectionRequest };