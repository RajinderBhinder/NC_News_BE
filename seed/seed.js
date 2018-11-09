const mongoose = require('mongoose');
const {Topic, Article, Comment, User} = require('../models');
const {getRefArray, formatArticleData, formatCommentData} = require('../utils');

const seedDB = ({userData, topicData, articleData, commentData}) => {
    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([Topic.insertMany(topicData), User.insertMany(userData)])

    })
    .then(([topicDocs, userDocs]) => {
        const userRefArray = getRefArray(userData, userDocs, 'username');
        
        return Promise.all([userRefArray, topicDocs, userDocs, Article.insertMany(formatArticleData(articleData, userRefArray))]);
         
     })
     .then(([userRefArray, topicDocs, userDocs, articleDocs]) => {
        const articleRefArray = getRefArray(articleData, articleDocs, 'title');
        return Promise.all([topicDocs, userDocs, articleDocs, 
            Comment.insertMany(formatCommentData(commentData, userRefArray, articleRefArray))])
     })
     .catch(console.log)
}

module.exports = seedDB;