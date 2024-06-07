const express = require('express');
const router = express.Router();
const { Home, customList, Delete, Post } = require("../controllers/controller");

router.get("/", Home);
router.post("/", Post);
router.post("/delete", Delete);
router.get("/:customListName", customList);

module.exports = router
