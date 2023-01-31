const express = require("express");
const router = express.Router();
const checkPermission = require("../middlewares/checkPermission");
const candidateController = require("../controller/candidateController");
const candRoleController = require("../controller/candRoleController");

router.post("/register", candidateController.registerCandidate);
router.get("/", candidateController.getAllCandidate);
router.get(
	"/getallpermissions",
	candidateController.getAllPermissionsToCandidate
);
router.delete("/", candidateController.deleteCandidate);
router.get("/getByEmail", candidateController.getCandidateByEmail);
router.post("/addRoles", candRoleController.addRoles);
router.get("/:id", candidateController.getCandidateById);
router.put("/:id", candidateController.updateCandidateById);

module.exports = router;
