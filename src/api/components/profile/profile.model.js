const mongoose = require("mongoose");

const Profile = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        default: "<h2>Wie ben ik?</h2><p>Beschrijf wie je bent, en geef enkele toffe weetjes over jezelf.</p><h2>Wat kan ik?</h2><p>Maak een lijstje van de dingen die je goed kan, zeker als je er veel ervaring mee hebt.</p>",
    },
    preferredCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
});

module.exports = mongoose.model("Profile", Profile);
