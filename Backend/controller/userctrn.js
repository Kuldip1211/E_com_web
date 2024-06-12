const { generateToken } = require("../config/Jwtoken");
const User = require("../modules/usermodel");
const asyncHandler = require("express-async-handler");

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    res.status(400).json({ message: "User already exists" });
  }
});

// Login user
const loginCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser._id,
      firstname: findUser.firstname,
      lastname: findUser.lastname,
      email: findUser.email,
      token: generateToken(findUser._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});


// get all the user
const gealltUsers = asyncHandler(async (req, res) => {
try{
 const getuser=await User.find();
 res.json({
  getuser
 })
}catch(err){
  throw new Error(err); 
}
})


module.exports = { createUser, loginCtrl,gealltUsers };
