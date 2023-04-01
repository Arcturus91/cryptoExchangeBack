const router = require("express").Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const cryptoInvRoutes = require("./cryptoInv.routes");
const financesRoutes = require("./finances.routes");
const cryptoPriceRoutes = require("./cryptoPrice.routes");

router.get("/", (req, res) => {
  res.status(200).json("all good here");
});

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", cryptoInvRoutes);
router.use("/admin", financesRoutes);
router.use("/cryptoprice", cryptoPriceRoutes);

module.exports = router;
