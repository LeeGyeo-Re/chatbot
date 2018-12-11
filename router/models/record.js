var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Record = new Schema({
  userId: String,
  records: String,
  created: {type:Date, default: Date.now}
});

module.exports = mongoose.model('record',Record);
