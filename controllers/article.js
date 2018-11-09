const {Article, User, Topic, Comment} = require('../models')

exports.getArticles = (req, res, next) => {
    Article.find()
    .populate('created_by', '-__v')
    .then((articleDocs) => {
        const updatedArticles = articleDocs.map(article => {
           article = article.toObject();
           return Comment.count({belongs_to: article._id})
           .then(commentCount => {

               article.comment_count = commentCount;
               return article;
           });
        })

        return Promise.all(updatedArticles)
        .then(articles => {

            res.status(200).send({articles})
        })
    })

}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    
    Article.findById(article_id)
    
    .then((article) => {
        if (!article) {
            return Promise.reject({status: 404, msg: `article not found for ${article_id}`})
        }
        
        return Promise.all([article, Comment.count({belongs_to: article_id})])
        .then(([article, commentCount]) => {
            article = article.toObject();
            article.comment_count = commentCount;

            res.status(200).send({article});
        
        })
    })
    .catch(next)

}

exports.updateArticleVoteCount = (req, res, next) => {
    const {article_id} = req.params;
    const {vote} = req.query;
    

    if (vote === 'up') {
        Article.findByIdAndUpdate(article_id, {$inc: {votes: 1}}, {new: true})
        .then(article => {
            res.status(201).send({article})
        })
        .catch(next)
    } else if(vote === 'down') {
        Article.findByIdAndUpdate(article_id, {$inc: {votes: -1}}, {new: true})
        .then(article => {
            res.status(201).send({article})
        })
        .catch(next)
    } else {
        return Promise.reject({status: 400, msg: 'Invalid request for updating vote'})
        .catch(next)
    }
}