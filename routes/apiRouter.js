const apiRouter = require('express').Router();
const commentRouter = require('./commentRouter');
const articleRouter = require('./articleRouter');
const topicRouter = require('./topicRouter');
const userRouter = require('./userRouter');
const {getDocumentation} = require('../controllers/api')

apiRouter.get('', getDocumentation);

apiRouter.use('/comments', commentRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/topics', topicRouter);

module.exports = apiRouter;