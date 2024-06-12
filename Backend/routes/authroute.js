const express = require("express");
const router = express.Router();
const { createUser, loginCtrl } = require("../controller/userctrn");

router.post("/register", createUser);
router.post("/login", loginCtrl);

module.exports = router;
