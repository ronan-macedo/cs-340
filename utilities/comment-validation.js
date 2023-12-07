const { body, validationResult } = require("express-validator");
const validate = {};

validate.commentRules = () => {
    return [
        body("comment_text")
            .trim()
            .notEmpty()
            .withMessage("Please, provide a comment.")
    ];
}

validate.checkCommentData = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
}

module.exports = validate;