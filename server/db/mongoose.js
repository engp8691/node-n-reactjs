const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://yonglin:turqu01se@ds237955.mlab.com:37955/todoapp');

module.exports = {mongoose};

