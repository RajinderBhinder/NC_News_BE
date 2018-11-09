const mongoose = require('mongoose');
const seedDB = require('./seed');
const rawData = require('./devData');
const DB_URL = process.env.DB_URL || require('../config');

mongoose.connect(DB_URL, { useNewUrlParser: true })
.then(() => {
    
    return seedDB(rawData)
})
.then(() => {
    console.log('seeded the database successfully');
    mongoose.disconnect();
    
})
.catch(console.log);
