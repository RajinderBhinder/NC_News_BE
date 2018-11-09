const commentRouter = require('express').Router();
const {getComments, getCommentById, updateCommentVoteCount, deleteComment} = require('../controllers/comment')

commentRouter.route('').get(getComments);
commentRouter.route('/:comment_id')
    .get(getCommentById)
    .patch(updateCommentVoteCount)
    .delete(deleteComment);

module.exports = commentRouter;