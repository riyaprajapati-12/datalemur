const express = require("express");
const { getUserProfile,createNewUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.post("/profile",authMiddleware,createNewUser);
module.exports = router;
