const express = require('express');
const app = express();
require("dotenv").config();
require("./conn/conn")
const userRoute = require("./routes/user.routes")
const bookRoute = require("./routes/book.routes")
const favoritesRoute = require("./routes/favorite.routes")
const cartRoute = require("./routes/cart.routes")
const orderRoute = require("./routes/order.routes")
const cors = require("cors")


// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello, World!");
})

// routes
app.use("/api/v1", userRoute)
app.use("/api/v1", bookRoute)
app.use("/api/v1", favoritesRoute)
app.use("/api/v1", cartRoute)
app.use("/api/v1", orderRoute)

app.listen(process.env.PORT || 5050, ()=>{
    console.log(`Serving on port ${process.env.PORT || 5050}`); 
})