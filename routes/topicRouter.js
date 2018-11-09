const topicRouter = require('express').Router();
const {getTopics, getArticlesByTopicSlug, addNewArticle} = require('../controllers/topic')

topicRouter.route('').get(getTopics)
topicRouter.route('/:topic_slug/articles').get(getArticlesByTopicSlug).post(addNewArticle);

module.exports = topicRouter;