const express = require("express");

const emojis = require("./emojis");
const candidateRoutes = require("./candidateRoutes");
const permissionRoutes = require("./permissionRoutes");
const roleRoutes = require("./roleRoutes");
const allocationRoutes = require("./allocationRoutes");
const userController = require("../controller/userController");

const router = express.Router();

router.get("/", (req, res) => {
	res.json({
		message: "API - 👋🌎🌍🌏",
	});
});
router.post("/login", userController.login);

router.use("/emojis", emojis);
router.use("/user", candidateRoutes);
router.use("/permission", permissionRoutes);
router.use("/role", roleRoutes);
router.use("/allocation", allocationRoutes);

module.exports = router;
