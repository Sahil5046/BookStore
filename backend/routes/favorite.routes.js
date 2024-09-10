const express = require("express");
const router = express.Router();
const authenticateToken = require("./userAuth")
const User = require("../models/user.model")
const Book = require("../models/book.model")


router.put("/add-book-to-favorite", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        if (!bookid || !id) {
            return res.status(400).json({ message: "Please provide book id and user id" });
        }
        // code for adding book to favorites goes here
        const user = await User.findById(id);

        const isBookFavorite = user.favourites.includes(bookid);
        if (isBookFavorite) {
            return res.status(200).json({ message: "Book already in favorites" });
        }

        await User.findByIdAndUpdate(id, {
            $push: { favourites: bookid }
        }, { new: true });

        return res.status(200).json({ message: "Book added to favorites successfully" });
    } catch (error) {
        console.log("Faild to add book to favorites", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


router.delete("/remove-book-from-favorite", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        if (!bookid || !id) {
            return res.status(400).json({ message: "Please provide book id and user id" });
        }
        // code for adding book to favorites goes here
        const user = await User.findById(id);

        const isBookFavorite = user.favourites.includes(bookid);
        if (isBookFavorite) {
            await User.findByIdAndUpdate(id, {
                $pull: { favourites: bookid }
            }, { new: true });
        }

        return res.status(200).json({ message: "Book removed from favorites successfully" });
    } catch (error) {
        console.log("Faild to remove book from favorites", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


router.get("/get-all-favorites-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        if (!id) {
            return res.status(400).json({ message: "Please provide user id" });
        }

        const user = await User.findById(id).populate("favourites");
        const favoriteBooks = user.favourites;

        //same work is done here
        // const books = await Book.find({_id: {$in: user.favourites}});
        return res.status(200).json({ data: favoriteBooks });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
})


module.exports = router