const express = require("express");
const router = express.Router();
const authenticateToken = require("./userAuth");
const User = require("../models/user.model")
const Book = require("../models/book.model");

router.put("/add-book-to-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        if (!bookid || !id) {
            return res.status(400).json({ message: "Please provide book id and user id" });
        }
        // code for adding book to favorites goes here
        const user = await User.findById(id);

        const isBookCart = user.cart.includes(bookid);
        if (isBookCart) {
            return res.status(200).json({ message: "Book already in cart" });
        }

        await User.findByIdAndUpdate(id, {
            $push: { cart: bookid }
        }, { new: true });

        return res.status(200).json({ message: "Book added to cart successfully" });
    } catch (error) {
        console.log("Faild to add book to cart", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

router.delete("/remove-book-from-cart/:bookid", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { bookid } = req.params;
        if (!bookid || !id) {
            return res.status(400).json({ message: "Please provide book id and user id" });
        }
        // code for adding book to favorites goes here
        const user = await User.findById(id);

        const isBookCart = user.cart.includes(bookid);
        if (isBookCart) {
            await User.findByIdAndUpdate(id, {
                $pull: { cart: bookid }
            }, { new: true });
        }

        return res.status(200).json({ message: "Book removed from cart successfully" });
    } catch (error) {
        console.log("Faild to remove book from cart", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

router.get("/get-all-cart-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        if (!id) {
            return res.status(400).json({ message: "Please provide user id" });
        }

        const user = await User.findById(id).populate("cart");
        const cartBooks = user.cart.reverse();

        //same work is done here
        // const books = await Book.find({_id: {$in: user.favourites}});
        return res.status(200).json({ data: cartBooks });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
})

module.exports = router;