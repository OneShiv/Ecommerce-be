const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 64,
    },
    description: {
        type: String,
        required: true,
        maxlength: 200,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    quantity: {
        type: Number,
    },
    image: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        required: false,
        type: String
    },
    sold: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", ProductSchema);