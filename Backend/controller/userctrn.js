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
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobail: req.body.mobail
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { createUser, loginCtrl, gealltUsers, deleteUsers, updateUser };
