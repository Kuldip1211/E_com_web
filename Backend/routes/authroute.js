const express = require("express");
const router = express.Router();
const { createUser, loginCtrl, gealltUsers, deleteUsers, updateUser } = require("../controller/userctrn");

router.post("/register", createUser);
router.post("/login", loginCtrl);
router.get("/all-user", gealltUsers);
router.delete("/:id", deleteUsers); // Changed to DELETE method
router.put("/:id", updateUser); // Changed to DELETE method
module.exports = router;
