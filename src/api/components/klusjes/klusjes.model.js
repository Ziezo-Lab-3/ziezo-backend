const mongoose = require('mongoose');

 const klusjeSchema = new mongoose.Schema({
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        state: { type: String, required: true, enum: ['open', 'in progress', 'done'] },
        images: { type: [], required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }, { timestamps: true });

module.exports = mongoose.model('Klusje', klusjeSchema);

