const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const User = require("../models/user.model")
const authenticateToken = require("./userAuth.js")
const Book = require("../models/book.model.js");
const { Mongoose } = require("mongoose");

// add book by admin
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can add books!" });
        }
        const book = new Book({
            author: req.body.author,
            title: req.body.title,
            url: req.body.url,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        })

        await book.save();
        return res.status(201).json({ message: "Book added successfully!" });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
})

router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        // console.log("Book updated", bookid);
        if (!bookid) return res.status(400).json({ message: "Please provide book ID" })

        const user = await User.findById(id);
        if (user.role !== "admin") return res.status(403).json({ message: "You do not have permission to update this book" })
            
        // validate book id or not
        // if (Mongoose.ObjectId.isValid(bookid)) {
        //     return res.status(401).json({ message: "Boook is not a valid" })
        // }

        const book = await Book.findByIdAndUpdate(bookid, {
            $set: {
                author: req.body.author,
                title: req.body.title,
                url: req.body.url,
                price: req.body.price,
                desc: req.body.desc,
                language: req.body.language,
            }
        }, { new: true });

        return res.status(200).json({ message: "Book updated successfully" })
    } catch (error) {
        // console.log("Error updating book: ", error);
        return res.status(404).json({ message: error.message });
    }
})

router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        // Extracting bookid and id from headers
        const { bookid } = req.headers;
        const userId = req.user.id; // Assuming the user ID is extracted from JWT in authenticateToken

        // console.log("Book to delete:", bookid);
        if (!bookid) return res.status(400).json({ message: "Please provide a book ID" });

        // Finding the user from the ID extracted from JWT
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Checking if the user has the admin role
        if (user.role !== "admin") return res.status(403).json({ message: "You do not have permission to delete this book" });

        // Deleting the book
        const book = await Book.findByIdAndDelete(bookid);
        if (!book) return res.status(404).json({ message: "Book not found" });

        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error.message);
        return res.status(500).json({ error: error.message });
    }
});


router.get("/get-all-books", async (req, res)=>{
    try {
        const books = await Book.find({}).sort({createdAt: -1})
        return res.status(200).json({ message: "Success",data:  books});
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
})

router.get("/get-recent-books", async (req, res)=>{
    try {
        const books = await Book.find({}).sort({createdAt: -1}).limit(4);
        return res.status(200).json({ message: "Success",data:  books});
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
})


router.get("/get-book-by-id/:id", async(req, res) =>{
    try {
        const {id}  = req.params;
        // console.log(id);

        const book = await Book.findById(id);
        // console.log(book);

        if(!book) return res.status(404).json({message: "Book not found"});
        return res.status(200).json({message: "Success", data: book});
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
})




module.exports = router;