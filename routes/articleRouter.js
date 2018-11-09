const articleRouter = require('express').Router();
const {getArticles, getArticleById, updateArticleVoteCount} = require('../controllers/article')
const {getCommentsByArticleId, addCommentToArticle} = require('../controllers/comment');

articleRouter.route('').get(getArticles)
articleRouter.route('/:article_id')
    .get(getArticleById)
    .patch(updateArticleVoteCount);
articleRouter.route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(addCommentToArticle);

module.exports = articleRouter;