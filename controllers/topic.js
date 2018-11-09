const {Topic, Article} = require('../models')

exports.getTopics = (req, res, next) => {
    Topic.find()
        .then((topics) => {
            res.status(200).send({topics})
        })

}

exports.getArticlesByTopicSlug = (req, res, next) => {
    const {topic_slug} = req.params;

    // Topic.count({slug: topic_slug})
    //     .then(count => {
    //         if (count === 0)  {
    //             return Promise.reject({status:400, msg: 'Invalid Slug'})
    //         } else {
                Article.find({'belongs_to': `${topic_slug}`})
                    .populate('created_by')
                    
                    .then((articles) => {
                        
                        if (articles.length === 0) {
                            return Promise.reject({status: 404, msg: `No articles found for ${topic_slug}`})
                        }
                        res.status(200).send({articles});
                    })
          //  }

       // })

    .catch(next)

}

exports.addNewArticle = (req, res, next) => {
    
    const {topic_slug} = req.params;
    
    newArticle = new Article({
        ...req.body,
        belongs_to: topic_slug,
        comment_count: 0
    })

    newArticle.save()
        .then(article => {
            res.status(201).send({article});
        })
        .catch(next)

}