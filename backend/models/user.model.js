const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairDreads02&accessoriesType=Prescription02&hairColor=Platinum&facialHairType=Blank&clotheType=ShirtVNeck&clotheColor=Blue01&eyeType=Happy&eyebrowType=UnibrowNatural&mouthType=Disbelief&skinColor=DarkBrown"
    },
    role: {
        type: String,
        required: true,
        default: "user",
        enum: ["user", "admin"]
    },
    favourites: [{
        type: mongoose.Types.ObjectId,
        ref: "books"
    }],
    cart: [{
        type: mongoose.Types.ObjectId,
        ref: "books"
    }],
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: "order"
    }],
}, { timestamps: true })


module.exports = mongoose.model("user", user);