const router = require("express").Router();

const {
addCash,
getAssets
} = require("../controllers/finances.controller");

const { verifyToken, checkRole } = require("../middleware");

router.post("/finances/addCash",verifyToken,checkRole(["Admin"]),addCash);
router.get("/finances/getAssets",verifyToken,checkRole(["Admin"]),getAssets)

module.exports = router;