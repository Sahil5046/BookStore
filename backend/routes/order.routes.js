const express = require('express');
const router = express.Router();
const User = require("../models/user.model")
// const Order = require("../models/order.model");
const Book = require("../models/book.model");
const Order = require("../models/order.model");
const authenticateToken = require("./userAuth")


router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDataFromDB = await newOrder.save();

            // saving order in user db
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDB._id }
            }, { new: true });

            // clearing cart data
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id }
            }, { new: true });
        }

        return res.status(200).json({ message: 'Successfully created order' });
    } catch (error) {
        console.error("Error in place order:", error);
        return res.status(500).json({ message: "Internal server Error", error });
    }
});


// get order history of a particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id).populate({
            path: 'orders',
            populate: { path: 'book' }
        });

        const orderData = user.orders.reverse();
        return res.status(200).json({ message: "Order history successfully fetched", data: orderData });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
})

// get all order admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const user = await Order.find({}).populate({
            path: "book",
        }).populate({
            path: "user",
            // select: ["name", "email"]
        }).sort({ createdAt: -1 })

        return res.status(200).json({ message: "All orders successfully fetched", data: user });
    } catch (error) {
        console.log("Error in get all order", error);
        return res.status(500).json({ message: error });
    }
})

router.put("/update-status/:bookid", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        // console.log(id);

        const {bookid} = req.params;
        // console.log(bookid);
        
        
        const user = await User.findById(id);
        // console.log(user);
        
        if (user.role !== "admin") return res.status(403).json({ message: "You are not admin role" });
        await Order.findByIdAndUpdate(bookid, {
            status: req.body.status,
            updatedAt: Date.now()
        })
        return res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
        // console.log("Error in update order status", error);
        return res.status(500).json({ message: "Something Error in Update Status" });
    }
})

module.exports = router;