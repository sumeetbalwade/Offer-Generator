const express = require("express");

const userRoutes = require("./userRoutes");
const permissionRoutes = require("./permissionRoutes");
const offerRoutes = require("./offerRoutes");
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

router.use("/user", userRoutes);
router.use("/permission", permissionRoutes);
router.use("/role", roleRoutes);
router.use("/allocation", allocationRoutes);
router.use("/offers", offerRoutes);

module.exports = router;
