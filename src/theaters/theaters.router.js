const router = require("express").Router()
const controller = require("./theaters.controller")
const methodNotAllowed = require("../utils/method-not-allowed")

router.route("/")
    .get(controller.list)
    .all(methodNotAllowed)



module.exports = router
