const commentModel = require("../models/comment-model");

const commentController = {};

commentController.getComments = async (req, res) => {
    const inv_id = parseInt(req.params.inv_id);

    try {
        const comments = await commentModel.getComments(inv_id);
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ errors: [error.message] });
    }
}

commentController.updateComment = async (req, res) => {
    const { comment_text, comment_id } = req.body;

    try {
        const result = await commentModel.updateComment(comment_text, comment_id);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ errors: ["An unexpected error occurred while updating the comment."] });
        }
    } catch (error) {
        return res.status(500).json({ errors: [error.message] });
    }
}

commentController.addComment = async (req, res) => {
    const { comment_text, account_id, inv_id } = req.body;

    try {
        const result = await commentModel.addComment(comment_text, account_id, inv_id);

        if (result) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json({ errors: ["An unexpected error occurred while adding the comment."] });
        }
    } catch (error) {
        return res.status(500).json({ errors: [error.message] });
    }
}

commentController.deleteComment = async (req, res) => {
    const { comment_id } = req.body;

    try {
        const result = await commentModel.deleteComment(comment_id);
        
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ errors: ["An unexpected error occurred while deleting the comment."] });
        }
    } catch (error) {
        return res.status(500).json({ errors: [error.message] });
    }
}

module.exports = commentController;