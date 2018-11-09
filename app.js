const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const DB_URL = process.env.DB_URL || require('./config');

mongoose.connect(DB_URL, { useNewUrlParser: true });


app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
    next({status: 404, msg: 'Path not found'})
})

app.use((err, req, res, next) => {
    
    if (err.name === 'CastError' || err.name === 'ValidationError') {err.status = 400, err.msg = err.message};
    res.status(err.status || 500).send( err || 'Internal Server Error')
})



module.exports = app;