const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const {User} = require("../schemas/user");

// authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (token) {
      // if token exists in header
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      if (verified) {
        console.log(`verified =>`, verified);
        const user = await User.findOne({ _id: verified._id }); // does this token belong to a user
        console.log(`user => `, user);
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(401).send("Access Denied 1");
        }
      } else {
        res.status(401).send("Access Denied 2");
      }
    } else {
      // if token does not exist in header
      res.status(401).send("Access Denied 3");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
