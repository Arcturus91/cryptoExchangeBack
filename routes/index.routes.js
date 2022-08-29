const router = require("express").Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const cryptoInvRoutes = require("./cryptoInv.routes");
const financesRoutes = require("./finances.routes");
const uploadRoutes = require("./upload.routes");


router.get("/", (req, res, next) => {
  res.json("HOME  SUCCESS");


});

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", cryptoInvRoutes);
router.use("/admin", financesRoutes);
router.use("/upload", uploadRoutes);

module.exports = router;
