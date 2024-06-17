const express = require("express");
const router = express.Router();
const {
  createUser,
  loginCtrl,
  gealltUsers,
  deleteUsers,
  updateUser,
  singlUService,
  blockuser,
  unblockuser,
  handleRefrashToken
} = require("../controller/userctrn");
const { AuthMiddleware , IsAdmin } = require("../middleware/authmiddleware");

router.post("/register", createUser);
router.post("/login", loginCtrl);
router.get("/all-user", gealltUsers);
router.get("/refresh",handleRefrashToken );
router.delete("/:id", deleteUsers);
router.get("/:id", AuthMiddleware, IsAdmin , singlUService);
router.put("/update-user",AuthMiddleware, updateUser);
router.get("/block-user/:id", AuthMiddleware, IsAdmin , blockuser);
router.get("/unblock-user/:id", AuthMiddleware, IsAdmin , unblockuser);


module.exports = router;
