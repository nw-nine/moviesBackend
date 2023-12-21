const router = require("express").Router()
const controller = require("./reviews.controller")
const methodNotAllowed = require("../utils/method-not-allowed")

router.route("/:reviewId")
    .put(controller.update)
    .delete(controller.destroy)
    .all(methodNotAllowed)

module.exports = router