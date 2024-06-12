const express = require("express");
const router = express.Router();
const { createUser, loginCtrl,gealltUsers } = require("../controller/userctrn");

router.post("/register", createUser);
router.post("/login", loginCtrl);
router.get("/all-user", gealltUsers);
module.exports = router;
