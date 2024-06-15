const express = require("express");
const router = express.Router();
const {
  createUser,
  loginCtrl,
  gealltUsers,
  deleteUsers,
  updateUser,
  singlUService
} = require("../controller/userctrn");
const { AuthMiddleware } = require("../middleware/authmiddleware");

router.post("/register", createUser);
router.post("/login", loginCtrl);
router.get("/all-user", gealltUsers);
router.delete("/:id", deleteUsers);
router.put("/:id", updateUser);
router.get("/:id", AuthMiddleware, singlUService);

module.exports = router;
