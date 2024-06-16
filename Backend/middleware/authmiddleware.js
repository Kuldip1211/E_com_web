const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../modules/usermodel");

const AuthMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);
        
        // Attach the user object to the request
        req.user = await User.findById(decoded.id).select("-password");

        // If user is not found
        if (!req.user) {
          res.status(401);
          throw new Error("Not authorized, user not found");
        }

        // Proceed to the next middleware or route handler
        next();
      } else {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});


const IsAdmin = asyncHandler(async(req, res, next)=>{
   const { email } = req.user;
   const adminUser =  await User.findOne( { email });
   if (adminUser.role !== "admin") {
    throw new Error("You are not a Admin");
   }else{
    next();
   }
})
module.exports = { AuthMiddleware ,IsAdmin };
