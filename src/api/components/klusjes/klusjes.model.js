const mongoose = require('mongoose');

 const klusjeSchema = new mongoose.Schema({
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        address: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        images: { type: [], required: true },
        state: { type: String, required: true, enum: ['open', 'in progress', 'awaiting payment', 'done', 'cancelled'] },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }, { timestamps: true });

module.exports = mongoose.model('Klusje', klusjeSchema);
