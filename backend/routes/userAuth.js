const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next)=>{
    const authHader = req.headers["authorization"];
    if(!authHader) return res.status(401).json({message: "Require Authorization header"})
    const token = authHader && authHader.split(" ")[1];

    if(!token) 
        return res.status(401).json({message: "Require Authorization token"})

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(500).json({message: "Your token is expier, please login again" });
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;