const router = require("express").Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const cryptoInvRoutes = require("./cryptoInv.routes");


router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes)
router.use("/user", userRoutes)
router.use("/admin", cryptoInvRoutes)

module.exports = router;
