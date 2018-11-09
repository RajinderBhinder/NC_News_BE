const mongoose = require('mongoose');
const {} = require('../models');


const getRefArray= (data, docs, key) => {
   return data.map((datum, index) => {

       return {
           [datum[key]]: docs[index]._id
        }
    
    } )
}

const getRefObject = (refArray, value) => {
    
    
    return refArray.reduce((acc, item) => {
        
        if (Object.keys(item).includes(value)) {
            acc = item[value];
        }
        return acc;
    }, {})
}

const formatArticleData = (articleData, userRefArray) => {
    return articleData.map(articleDatum => {
        return {
            title: articleDatum.title,
            body: articleDatum.body,
            created_at: articleDatum.created_at,
            belongs_to: articleDatum.topic,
            created_by: getRefObject(userRefArray, articleDatum.created_by)
        }
    })
  
}

const formatCommentData = (commentData, userRefArray, articleRefArray) => {
   return commentData.map(commentDatum => {
       return { 
        ...commentDatum,
        created_by: getRefObject(userRefArray, commentDatum.created_by),
        belongs_to: getRefObject(articleRefArray, commentDatum.belongs_to)
       }
   })
}

module.exports = {getRefArray, formatArticleData, formatCommentData};