process.env.NODE_ENV = 'test';
const app = require('../app');
const DB_URL = require('../config');
const mongoose = require('mongoose');
const request = require('supertest')(app); 
const {expect} = require('chai');
const seedDB = require('../seed/seed');
const testData = require('../seed/testData');
const {Article} = require('../models')


describe('/api', () => {

    let userDocs, topicDocs, articleDocs, commentDocs;
    const wrongId = mongoose.Types.ObjectId();


    const getComments = () => {
        return commentDocs.filter(comment => 
            comment.belongs_to === articleDocs[0]._id
        )
    }


    beforeEach(() => {

            return seedDB(testData)
            .then((docs ) => {
                [topicDocs, userDocs, articleDocs, commentDocs] = docs;
                
            })
        
    })

    after(() =>  {return  mongoose.disconnect()});

    //---------------WRONG PATH-----------------//

    describe('/wrongPath', () => {
        it('GET returns 404 and error message', () => {
            return request.get('/wrongPath')
            .expect(404)
            .then(res => {
                expect(res.body.msg).to.equal('Path not found')
            })
        });
    });

    //------------------USERS-------------------//

   describe('/users', () => {
       it('GET returns 200 and all the users', () => {
           return request.get('/api/users')
           .expect(200)
           .then(({body: {users}}) => {
               expect(users.length).to.equal(userDocs.length);
               expect(users[0].name).to.equal(userDocs[0].name);
               expect(users[0].username).to.equal(userDocs[0].username);
               expect(users[0].avatar_url).to.equal(userDocs[0].avatar_url)
           })
       });
   });
   describe('/users/:user_name', () => {

       it('GET returns 200 and the requested user', () => {
        return request.get(`/api/users/${userDocs[0].username}`)
        .expect(200)
        .then(({body: {user}}) => {
            expect(user.name).to.equal(userDocs[0].name);
            expect(user.username).to.equal(userDocs[0].username);
            expect(user.avatar_url).to.equal(userDocs[0].avatar_url)
        })
       });

       it('GET for invalid username or a user that does not exist in collection - returns 404 and the error message', () => {
           return request.get('/api/users/someone')
           .expect(404)
           .then((res) => {
               
               expect(res.body.msg).to.equal('There is no User for username "someone"');
           })

       });
   });

   //------------------TOPICS-------------------//

   describe('/topics', () => {
        it('GET returns 200 and all the topics', () => {
            return request.get('/api/topics')
            .expect(200)
            .then(({body: {topics}}) => {
                expect(topics.length).to.equal(topicDocs.length);
                expect(topics[0].title).to.equal(topicDocs[0].title);
                expect(topics[0].slug).to.equal(topicDocs[0].slug);
            })
        });
    });
    describe('/topics/:topic_slug/articles', () => {

        describe('GET', () => {
            it('GET returns 200 and articles for the the requested topic slug', () => {
                const getArticleCount = () => {
                    return articleDocs.filter(article => 
                        article.belongs_to === topicDocs[0].slug
                    ).length
                }
                
                return request.get(`/api/topics/${topicDocs[0].slug}/articles`)
                .expect(200)
                .then(({body: {articles}}) => {
                    expect(articles.length).to.equal(getArticleCount());
                    expect(articles[0].belongs_to).to.equal(topicDocs[0].slug);
                })
            });
    
            // it('GET for invalid topic slug returns 400 and the error message', () => {
            //     return request.get('/api/topics/something/articles')
            //     .expect(400)
            //     .then((res) => {
                    
            //         expect(res.body.msg).to.equal('Invalid Slug');
            //     })
    
            // });
    
            it('GET for a valid slug that has no articles - returns 404 and the error message', () => {
                return request.get(`/api/topics/gardening/articles`)
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).to.equal(`No articles found for gardening`);
            })
    
            });
        });
        
        describe('POST', () => {
            it('POST returns 201 and the added article', () => {
                const postedArticle = {
                    title: 'The new Article',
                    body: 'This is a new article to be added to the Articles collection.',
                    created_by: `${userDocs[0]._id}`
                }
                return request.post(`/api/topics/${topicDocs[0].slug}/articles`)
                .send(postedArticle)
                .expect(201)
                .then(({body: {article}}) => {
                    expect(article.title).to.equal(postedArticle.title);
                    expect(article.body).to.equal(postedArticle.body);
                    expect(article.created_by).to.equal(postedArticle.created_by)
                })
            });
    
            it('POST with wrong input data returns 400 and the error message', () => {
                const postedArticle = {
                    title: 'The new Article',
                    body: 'This is a new article to be added to the Articles collection.',
                    created_by: 'user_id'
                }
                return request.post(`/api/topics/${topicDocs[0].slug}/articles`)
                .send(postedArticle)
                .expect(400)
                .then(res => {
                    expect(res.body.msg).to.equal('articles validation failed: created_by: Cast to ObjectID failed for value "user_id" at path "created_by"');
                    
                })
            });
        });

        
    });

    //-----------------ARTICLES-------------------//
    describe('/articles', () => {
        it('GET returns 200 and all the articles', () => {
            return request.get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).to.equal(articleDocs.length);
                expect(articles[0].title).to.equal(articleDocs[0].title);
                expect(articles[0].body).to.equal(articleDocs[0].body);
                expect(articles[0].votes).to.equal(articleDocs[0].votes);
                expect(articles[0].comment_count).to.equal(getComments().length)
            })
        });
    });
    describe('/articles/:article_id', () => {

        describe('GET', () => {
            it('GET returns 200 and the requested article', () => {
                return request.get(`/api/articles/${articleDocs[0]._id}`)
                .expect(200)
                .then(({body: {article}}) => {
                    expect(article.title).to.equal(articleDocs[0].title);
                    expect(article.body).to.equal(articleDocs[0].body);
                    expect(article.votes).to.equal(articleDocs[0].votes)
                })
            });
        
            it('GET for an invalid ID returns a status 400 and error message', () => {
                return request.get('/api/articles/123')
                .expect(400)
                .then((res) => {    
                    expect(res.body.msg).to.equal('Cast to ObjectId failed for value "123" at path "_id" for model "articles"');
                })
            });
            
            it('GET for a valid mongo ID that doesn’t exist in collection - returns a status 404 and error message', () => {
                return request.get(`/api/articles/${wrongId}`)
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).to.equal(`article not found for ${wrongId}`);
                })
            });
        });

        describe('PATCH', () => {
            it('PATCH returns 201 and updates the vote count for the requested article', () => {
                return request.patch(`/api/articles/${articleDocs[0]._id}?vote=up`)
                .expect(201)
                .then(({body: {article}}) => {
                    expect(article.votes).to.equal(articleDocs[0].votes + 1);
                })
            });

            it('PATCH with an invalid update value for vote - returns 400 and the error message', () => {
                return request.patch(`/api/articles/${articleDocs[0]._id}?vote=high`)
                .expect(400)
                .then(res => {
                    expect(res.body.msg).to.equal('Invalid request for updating vote');
                })
            });
            
        });
    });
    describe('/articles/:article_id/comments', () => {
        describe('GET', () => {

            it('GET returns 200 and all comments for the requested article', () => {

                return request.get(`/api/articles/${articleDocs[0]._id}/comments`)
                .expect(200)
                .then(({body: {comments}}) => {
                    expect(comments.length).to.equal(getComments().length)
                    expect(comments[0].body).to.equal(getComments()[0].body)
                    expect(comments[0].belongs_to._id).to.equal(`${articleDocs[0]._id}`);
                })
            });

            it('GET for article with no comments - returns 404 and the error message', () => {
                return request.get(`/api/articles/${wrongId}/comments`)
                .expect(404)
                .then(res => {
                    expect(res.body.msg).to.equal(`No comments found for article "${wrongId}"`)
                })
            });

            it('GET for non-existant article - returns 404 and the error message', () => {
                return request.get(`/api/articles/${wrongId}/comments`)
                .expect(404)
                .then(res => {
                    expect(res.body.msg).to.equal(`No comments found for article "${wrongId}"`)
                })
            });
        });
        describe('POST', () => {
            it('POST returns 201 and the added comment', () => {
                const postedComment = {
                    body: 'This is my new comment.',
                    created_by: `${userDocs[0]._id}`
                }
                return request.post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send(postedComment)
                .expect(201)
                .then(({body: {comment}}) => {
                    expect(comment.body).to.equal(postedComment.body);
                    expect(comment.created_by._id).to.equal(`${postedComment.created_by}`)
                })
            });

            it('POST with wrong input data returns 400 and the error message', () => {
                const postedComment = {
                    body: {comment: 123},
                    created_by: `${userDocs[0]._id}`
                }
                return request.post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send(postedComment)
                .expect(400)
                .then(res => {
                    expect(res.body.msg).to.equal('comments validation failed: body: Cast to String failed for value "{ comment: 123 }" at path "body"');
                    
                })
            });
        });
    });

    //----------------COMMENTS------------------//
    describe('/comments', () => {
        it('GET returns 200 and all the comments', () => {
            return request.get('/api/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments.length).to.equal(commentDocs.length);
                expect(comments[0].body).to.equal(commentDocs[0].body);
                expect(comments[0].votes).to.equal(commentDocs[0].votes);
            })
        });
    });
    describe('/comments/:comment_id', () => {

        describe('GET', () => {
            it('GET returns 200 and the requested comment', () => {
                return request.get(`/api/comments/${commentDocs[0]._id}`)
                .expect(200)
                .then(({body: {comment}}) => {
                    expect(comment.body).to.equal(commentDocs[0].body);
                    expect(comment._id).to.equal(`${commentDocs[0]._id}`)
                })
            });
        
            it('GET for an invalid ID returns a status 400 and error message', () => {
                return request.get('/api/comments/123')
                .expect(400)
                .then((res) => {    
                    expect(res.body.msg).to.equal('Cast to ObjectId failed for value "123" at path "_id" for model "comments"');
                })
            });
            
            it('GET for a valid mongo ID that doesn’t exist in collection - returns a status 404 and error message', () => {
                return request.get(`/api/comments/${wrongId}`)
                .expect(404)
                .then((res) => {
                    expect(res.body.msg).to.equal(`comment not found for ${wrongId}`);
                })
            });
        });

        describe('PATCH', () => {
            it('PATCH returns 201 and updates the vote count for the requested comment', () => {
                return request.patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
                .expect(201)
                .then(({body: {comment}}) => {
                    expect(comment.votes).to.equal(commentDocs[0].votes - 1);
                })
            });

            it('PATCH with an invalid update value for vote - returns 400 and the error message', () => {
                return request.patch(`/api/comments/${commentDocs[0]._id}?vote=low`)
                .expect(400)
                .then(res => {
                    expect(res.body.msg).to.equal('Invalid request for updating vote');
                })
            });
            
        });

        describe('DELETE', () => {
            it('DELETE deletes the required comment and return the appropriate message', () => {
                return request.delete(`/api/comments/${commentDocs[0]._id}`) 
                .expect(201)
                .then(res => {
                    expect(res.body.msg).to.equal('Comment deleted!')
                })
            });
        });
    });

});