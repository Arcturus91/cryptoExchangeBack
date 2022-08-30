const router = require("express").Router();

const {getLoggedUser,
   /*  editProfile,getUserById,deleteAccount,onlyAdminRead */
   buyCripto,
   sellCripto,
   createBankAccount,
   editBankAccount,
   deleteBankAccount
} = require ("../controllers/user.controller");

const {verifyToken} = require ("../middleware")

router.get("/my-profile", verifyToken, getLoggedUser)

router.post("/my-profile/buy", verifyToken,buyCripto )

router.post("/my-profile/sell", verifyToken,sellCripto )

router.post("/my-profile/create-bank-account", verifyToken,createBankAccount)

router.patch("/my-profile/edit-bank-account", verifyToken,editBankAccount)

router.patch("/my-profile/delete-bank-account", verifyToken,deleteBankAccount)




//router.patch("/edit-profile", verifyToken, editProfile)

//router.delete("/delete-user",verifyToken,deleteAccount)

//read - other user

//router.get("/:id/profile",verifyToken, getUserById)

//read all user (para admin staff)





module.exports = router;