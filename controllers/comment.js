const {Comment, User, Topic} = require('../models')

exports.getComments = (req, res, next) => {
    Comment.find()
    .populate('belongs_to')
    .populate('created_by')
    .then((comments) => {
        res.status(200).send({comments})
    })

}


exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    Comment.find({belongs_to: article_id})
    .populate('belongs_to', 'title')
    .populate('created_by', 'name')
    .then(comments => {
        if (comments.length === 0) {
            return Promise.reject({status: 404, msg: `No comments found for article "${article_id}"`})
        }
        res.status(200).send({comments});
    })
    .catch(next)
}

exports.addCommentToArticle = (req, res, next) => {
    const {article_id} = req.params;
    
    newComment = new Comment({
        ...req.body,
        belongs_to: article_id
    })
    newComment.save()
    .then(rawComment => {
        return rawComment.populate('created_by').execPopulate()
        
    })
    .then(comment => {

        res.status(201).send({comment});
    })
    .catch(next)
}

exports.getCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    
    Comment.findById(comment_id)
    .populate('belongs_to')
    .populate('created_by')

    .then((comment) => {
        if (!comment) {
            return Promise.reject({status: 404, msg: `comment not found for ${comment_id}`})
        }
        res.status(200).send({comment});
    })
    .catch(next)

}

exports.updateCommentVoteCount = (req, res, next) => {
    const {comment_id} = req.params;
    const {vote} = req.query;
    const update = vote === 'up' ? {$inc: {votes: 1}} : {$inc: {votes: -1}};

    if (vote === 'up' || vote === 'down') {
        Comment.findByIdAndUpdate(comment_id, update, {new: true})
        .then(comment => {
            res.status(201).send({comment})
        })
        .catch(next)
     } else {
        return Promise.reject({status: 400, msg: 'Invalid request for updating vote'})
        .catch(next)
    }
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params;

    Comment.findByIdAndDelete(comment_id)
    .then(() => {
        const msg = 'Comment deleted!';
        res.status(201).send({msg})
    })

}
