const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        jwt.verify(token, process.env.SECRET_CODE, (err, decoded) => {
            
            if (err) {
                return res.status(401).json({ message: "Something went wrong", success: false });
            }
            req.body.user = decoded.id;
            console.log(decoded.id)
            next();
        });
    } else {
        return res.status(401).json({ message: "Something went wrong", success: false });
    }
};

module.exports = authorization;