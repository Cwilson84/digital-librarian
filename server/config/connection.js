const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/digital-librarian')

module.exports = mongoose.connection;
