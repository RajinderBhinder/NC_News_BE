# Northcoders News API




## Introduction



This repository contains a RESTful API for a website `Northcoders News` built using Node, MongoDB, Express, and Mongoose. 
Northcoders News has a database of `Topics` - each of which includes various `Articles`. The `Users` in the database can add `Comments` to articles or also contribute a new article. Both the articles and the comments can be upvoted or downvoted by the users. 

Live version of this app hosted on Heroku can be found [here](https://rajinder-presenting-nc-news.herokuapp.com/api), which provides more information on the functionality of the API by listing all the available routes.


## Getting Started



If you want to try out the API on your local machine, follow these steps:


### **Installation**



Check you have Node.js installed:

```
npm --v
```

Check you have MongoDB installed:

```
mongo --version
```

Check you have git installed:

```
git --v
```


###  **Dependencies**


You will also need:
- express
- mocha
- chai
- body-parser
- supertest
- nodemon



## Steps


1. Clone this repository:

```
git clone https://github.com/RajinderBhinder/BE2-northcoders-news
``` 

2. Navigate into the cloned repository, then install all the above mentioned dependencies:

```
 npm i
```

3. Start MongoDB:

```
mongod
```

4. Create a config file inside a config folder:

```
mkdir config
touch config.js
```
5. Copy the following code into the config file:

```
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const config = {
    dev: 'mongodb://localhost:27017/nc_news',
    test: 'mongodb://localhost:27017/nc_news_test'
}
module.exports = config[process.env.NODE_ENV];
```


6. In a new terminal window, seed the development database:

```
npm run seed:dev
```

7. Run the server on your local machine:

```
npm start
```

This will allow the API to be accessed through port 9090.

## EndPoints

A list of all the endpoints can be found at https://rajinder-presenting-nc-news.herokuapp.com/api



## Testing

Tests have been provided for each endpoint to check all the successful and unsucessful HTTP requests.

To test the endpoints on your local machine use the command:

```JavaScript
npm test
```



## Deployment



This app has been deployed to [Heroku](www.heroku.com)


The database has been hosted on [mLab](https://mlab.com/)

## Author

Name: Rajinder Kaur

Git: [RajinderBhinder](https://github.com/RajinderBhinder)

