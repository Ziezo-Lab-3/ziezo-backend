const mongoose = require("mongoose");

const User = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        name_first: {
            type: String,
            required: true,
        },
        name_last: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
        },
        gender: {
            type: String,
            enum: [ 'm', 'f', 'x']
        },
        date_birth: {
            type: Date,
        },
        avatar: {
            type: String,
        },

        address_number: {
            type: String,
        },
        address_street: {
            type: String,
        },
        address_city: {
            type: String,
        },
        address_state: {
            type: String,
        },
        address_zip: {
            type: String,
        },
        address_country: {
            type: String,
        },

        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", User);
