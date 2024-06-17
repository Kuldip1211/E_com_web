const { generateToken } = require("../config/Jwtoken");
const User = require("../modules/usermodel");
const asyncHandler = require("express-async-handler");
const validateMongodbid = require("../utils/validMongobdid");
const ganrateRefrashToken = require("../config/Refreshtoken");
const jwt = require('jsonwebtoken');


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
    const refreshToken = await ganrateRefrashToken(findUser?.id);
    const updateUSer = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
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

// handle refrshtoken
const handleRefrashToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if(!cookie?.refreshToken)throw new Error("no refresh token in the cookie")
    const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne( {refreshToken});
  if(!user) throw new Error ("no refresh token in the db or not matched");
  jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
    if(err || user.id !== decoded.id){
      throw new Error("something wrong with decoded id");
    }
    const acrossToken = generateToken(user?._id)
    res.json({
      acrossToken
    })
  })
});

// get all the user
const gealltUsers = asyncHandler(async (req, res) => {
  try {
    const getuser = await User.find();
    res.json({
      getuser,
    });
  } catch (err) {
    throw new Error(err);
  }
});

// delet the user
const deleteUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    res.json({
      deletedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// update the user
const updateUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  const { _id } = req.user;
  validateMongodbid();
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobail: req.body.mobail,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// block the user
const blockuser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User blocked",
      user: block,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// unblock the user
const unblockuser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    validateMongodbid();
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User unblocked",
      user: block,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});
// get the single user
const singlUService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbid();
  try {
    const getsu = await User.findById(id);
    res.json(getsu);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createUser,
  loginCtrl,
  gealltUsers,
  deleteUsers,
  updateUser,
  singlUService,
  blockuser,
  unblockuser,
  handleRefrashToken,
};
