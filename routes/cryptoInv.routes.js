const router = require("express").Router();

const {
  checkInventory,
  createCrypto,
  buyInventory,
} = require("../controllers/crypto.controller");

const { verifyToken, checkRole } = require("../middleware");

router.post(
  "/inventory/create",
  verifyToken,
  checkRole(["Admin"]),
  createCrypto
);

router.get("/inventory", verifyToken, checkRole(["Admin"]), checkInventory);

router.post("/inventory/buy", verifyToken, checkRole(["Admin"]), buyInventory);

module.exports = router;
