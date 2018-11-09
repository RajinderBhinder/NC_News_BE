process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const config = {
    dev: 'mongodb://localhost:27017/nc_news',
    test: 'mongodb://localhost:27017/nc_news_test',
    production: 'mongodb://rajinder:be2project@ds241530.mlab.com:41530/nc_news'
}

module.exports = config[process.env.NODE_ENV];