const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const commentController = require("../controllers/commentController");
const commentValidate = require("../utilities/comment-validation");

router.get("/getComments/:inv_id", utilities.handleErrors(commentController.getComments));

router.post(
    "/addComment",
    commentValidate.commentRules(),
    commentValidate.checkCommentData,
    utilities.handleErrors(commentController.addComment));

router.post(
    "/updateComment",
    commentValidate.commentRules(),
    commentValidate.checkCommentData,
    utilities.handleErrors(commentController.updateComment));

router.post(
    "/deleteComment",
    utilities.handleErrors(commentController.deleteComment));

module.exports = router;