const mongoose = require("mongoose");

const User = new mongoose.Schema(
    {
        email: String,
        password: String,
        phone: String,

        gender: String,
        date_birth: Date,

        name_first: String,
        name_last: String,
        name: {
            type: String,
            default: function () {
                return this.name_first + " " + this.name_last;
            },
        },

        address_number: String,
        address_street: String,
        address_city: String,
        address_state: String,
        address_zip: String,
        address_country: String,
        
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
