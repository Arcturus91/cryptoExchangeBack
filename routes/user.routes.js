const router = require("express").Router();

const {uploadProcess} = require ("../controllers/upload.controller");
const uploadCloud = require ("../helpers/cloudinary")

const {getLoggedUser,
   /*  editProfile,getUserById,deleteAccount,onlyAdminRead */
   buyCripto,
   sellCripto,
   createBankAccount,
   editBankAccount,
   deleteBankAccount,
   addBTCwallet,
   addETHwallet
} = require ("../controllers/user.controller");

const {verifyToken,checkWallet,checkRole,checkBankAccount} = require ("../middleware")

router.get("/my-profile", verifyToken, getLoggedUser)


router.post("/my-profile/singleUpload",uploadCloud.single("image"),uploadProcess)

router.post("/my-profile/buy", verifyToken,checkRole(["User"]),checkWallet,buyCripto ) //user needs to have a proper crypto wallet to buy the crypto.

router.post("/my-profile/sell", verifyToken,checkRole(["User"]),checkBankAccount,sellCripto ) //user needs to have registered bank account for selling crypto.

router.post("/my-profile/create-bank-account", verifyToken,createBankAccount)

router.patch("/my-profile/edit-bank-account", verifyToken,editBankAccount)

router.patch("/my-profile/delete-bank-account", verifyToken,deleteBankAccount)

router.post("/my-profile/add-btc-wallet", verifyToken,addBTCwallet)

router.post("/my-profile/add-eth-wallet", verifyToken,addETHwallet)


//router.patch("/edit-profile", verifyToken, editProfile)

//router.delete("/delete-user",verifyToken,deleteAccount)

//read - other user

//router.get("/:id/profile",verifyToken, getUserById)

//read all user (para admin staff)





module.exports = router;