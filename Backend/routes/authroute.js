const express = require("express");
const router = express.Router();
const { createUser, loginCtrl, gealltUsers, deleteUsers } = require("../controller/userctrn");

router.post("/register", createUser);
router.post("/login", loginCtrl);
router.get("/all-user", gealltUsers);
router.delete("/:id", deleteUsers); // Changed to DELETE method
module.exports = router;
