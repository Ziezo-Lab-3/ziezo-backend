const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    sender: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        required: true,
        type: String
    },
    chatGroup: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatGroup'
    },
    html: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', dataSchema)