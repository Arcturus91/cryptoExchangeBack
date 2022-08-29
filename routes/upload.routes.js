const router = require("express").Router();

const {uploadProcess} = require ("../controllers/upload.controller");

const uploadCloud = require ("../helpers/cloudinary")

router.post("/single",uploadCloud.single("image"),uploadProcess)

module.exports = router;